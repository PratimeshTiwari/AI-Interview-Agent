import { OpenAI } from "openai";
import { NextResponse } from "next/server";
import { INTERVIEWER_SYSTEM_PROMPT } from "@/lib/prompts";
import dbConnect from "@/lib/db";
import Memory from "@/models/Memory";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { messages, resume, jobDescription, role, userId } = await req.json();

        // Fetch memories from MongoDB
        const memories = userId ? await Memory.find({ userId }).sort({ createdAt: -1 }).limit(10) : [];

        // Format memories for the prompt
        const memoryContext = memories.length > 0
            ? memories.map((m: any) => `- ${m.type.toUpperCase()}: ${m.text}`).join("\n")
            : "No prior memories.";

        // Construct the full system prompt with context
        const systemMessage = {
            role: "system",
            content: `${INTERVIEWER_SYSTEM_PROMPT}
      
      **CONTEXT:**
      - **Role**: ${role || "General"}
      - **Resume Summary**: ${resume || "Not provided"}
      - **Job Description**: ${jobDescription || "Not provided"}

      **LEARNING HISTORY (Past Interactions):**
      ${memoryContext}
      `,
        };

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Use mini for speed/cost, switch to gpt-4o for quality
            messages: [systemMessage, ...messages],
            response_format: { type: "json_object" }, // Enforce JSON output
            temperature: 0.7,
        });

        const content = response.choices[0].message.content;
        if (!content) {
            throw new Error("No content received from OpenAI");
        }

        const parsedContent = JSON.parse(content);

        // Save new memory to MongoDB if present
        if (parsedContent.memory && userId) {
            await Memory.create({
                userId,
                text: parsedContent.memory.text,
                type: parsedContent.memory.type
            });
        }

        return NextResponse.json(parsedContent);
    } catch (error) {
        console.error("Error in chat API:", error);
        return NextResponse.json(
            { error: "Failed to generate response" },
            { status: 500 }
        );
    }
}
