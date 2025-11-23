import { OpenAI } from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { messages, role } = await req.json();

        const systemPrompt = `
      You are an expert Interview Evaluator. 
      Analyze the following interview transcript for the role of "${role}".
      
      **SCORING GUIDELINES:**
      1. If the interview has fewer than 3 user responses, the score should be low (max 20).
      2. If the interview has fewer than 5 user responses, the score should be below 40.
      3. One-word or low-effort answers should keep the score below 60.
      4. Scores above 70 are reserved for detailed, thoughtful responses.
      
      Provide a structured summary in JSON format with the following fields:
      - score: A number between 0-100.
      - strengths: A list of 2-3 key strengths demonstrated.
      - weaknesses: A list of 2-3 areas for improvement.
      - summary: A concise paragraph (max 3 sentences) summarizing the candidate's performance.
      
      Output ONLY valid JSON.
    `;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                ...messages
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
        });

        const content = response.choices[0].message.content;
        if (!content) {
            throw new Error("No content received from OpenAI");
        }

        return NextResponse.json(JSON.parse(content));
    } catch (error) {
        console.error("Error in summary API:", error);
        return NextResponse.json(
            { error: "Failed to generate summary" },
            { status: 500 }
        );
    }
}
