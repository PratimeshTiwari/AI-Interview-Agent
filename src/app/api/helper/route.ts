import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { message, context } = await req.json();

        console.log("Gemini API Key exists:", !!process.env.GEMINI_API_KEY);

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: "Gemini API Key not configured" },
                { status: 500 }
            );
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // Construct a context-aware prompt
        let contextString = "";
        if (context) {
            contextString = `
            USER CONTEXT:
            - Name: ${context.user?.name || "Candidate"}
            - Target Role: ${context.user?.role || "Software Engineer"}
            - Resume Summary: ${context.user?.resume ? context.user.resume.substring(0, 500) + "..." : "Not provided"}
            
            PAST INTERVIEWS (Last 3):
            ${context.history?.map((h: any) => `- Role: ${h.role}, Score: ${h.score}%, Summary: ${h.summary}`).join("\n") || "None"}
            
            KNOWN FACTS (Memories):
            ${context.memories?.map((m: any) => `- ${m.text} (${m.type})`).join("\n") || "None"}
            `;
        }

        const prompt = `
      You are a helpful Interview Preparation Assistant.
      Your goal is to answer the user's questions about interview tips, common questions, or career advice.
      Use the provided context to personalize your advice.
      Keep your answers concise, encouraging, and practical.
      
      ${contextString}

      User's Question: ${message}
    `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        return NextResponse.json({ response: text });
    } catch (error) {
        console.error("Error in Gemini Helper API:", error);
        return NextResponse.json(
            { error: "Failed to generate response" },
            { status: 500 }
        );
    }
}
