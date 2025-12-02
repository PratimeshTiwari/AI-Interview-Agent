import { OpenAI } from "openai";
import { NextResponse } from "next/server";
import { INTERVIEWER_SYSTEM_PROMPT } from "@/lib/prompts";
import { generateEmbedding } from "@/lib/embeddings";
import dbConnect from "@/lib/db";
import Memory from "@/models/Memory";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { messages, resume, jobDescription, role, userId } = await req.json();

        // 1. Generate embedding for the user's latest message
        const lastUserMessage = messages[messages.length - 1].content;
        const queryEmbedding = await generateEmbedding(lastUserMessage);

        // 2. Perform Vector Search to find relevant memories
        const memories = await Memory.aggregate([
            {
                $vectorSearch: {
                    index: "vector_index",
                    path: "embedding",
                    queryVector: queryEmbedding,
                    numCandidates: 100,
                    limit: 5,
                    filter: { userId: userId }
                }
            },
            {
                $project: {
                    _id: 0,
                    text: 1,
                    type: 1,
                    score: { $meta: "vectorSearchScore" }
                }
            }
        ]);

        // Format memories for the prompt
        const memoryContext = memories.map((m: any) => `[${m.type.toUpperCase()}] ${m.text}`).join("\n");

        const systemPrompt = INTERVIEWER_SYSTEM_PROMPT
            .replace("{{resume}}", resume || "No resume provided.")
            .replace("{{job_description}}", jobDescription || "No job description provided.")
            .replace("{{role}}", role || "Software Engineer")
            .replace("{{memory_bank}}", memoryContext || "No relevant memories found.");

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: systemPrompt },
                ...messages
            ],
            response_format: { type: "json_object" }
        });

        const content = response.choices[0].message.content;
        if (!content) throw new Error("No content received from OpenAI");

        const parsedResponse = JSON.parse(content);

        // KERNEL LOGGING
        if (parsedResponse.analysis) {
            console.log("--- KERNEL LOG ---");
            console.log(`Phase: ${parsedResponse.analysis.phase} `);
            console.log(`Behavior: ${parsedResponse.analysis.behavior_log} `);
            console.log(`Plagiarism: ${parsedResponse.analysis.plagiarism_score}% `);
            console.log("------------------");
        }

        // 3. Save new memory with embedding if generated
        if (parsedResponse.memory) {
            const memoryText = parsedResponse.memory.text;
            const memoryEmbedding = await generateEmbedding(memoryText);

            await Memory.create({
                userId: userId,
                text: memoryText,
                type: parsedResponse.memory.type,
                embedding: memoryEmbedding
            });
        }

        return NextResponse.json(parsedResponse);

    } catch (error) {
        console.error("Error in chat API:", error);
        return NextResponse.json(
            { error: "Failed to generate response" },
            { status: 500 }
        );
    }
}
