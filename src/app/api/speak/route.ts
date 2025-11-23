import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        if (!text) {
            return NextResponse.json({ error: "Text is required" }, { status: 400 });
        }

        const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
        const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM"; // Default to Rachel

        // 1. Try ElevenLabs
        if (ELEVENLABS_API_KEY) {
            try {
                const response = await fetch(
                    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "xi-api-key": ELEVENLABS_API_KEY,
                        },
                        body: JSON.stringify({
                            text,
                            model_id: "eleven_turbo_v2_5",
                            voice_settings: {
                                stability: 0.5,
                                similarity_boost: 0.75,
                            },
                        }),
                    }
                );

                if (response.ok) {
                    const audioBuffer = await response.arrayBuffer();
                    return new NextResponse(audioBuffer, {
                        headers: { "Content-Type": "audio/mpeg" },
                    });
                } else {
                    console.warn("ElevenLabs API failed, falling back to OpenAI...");
                }
            } catch (err) {
                console.warn("ElevenLabs error, falling back to OpenAI:", err);
            }
        }

        // 2. Fallback to OpenAI TTS
        console.log("Using OpenAI TTS (HD)...");
        const mp3 = await openai.audio.speech.create({
            model: "tts-1-hd",
            voice: "onyx",
            input: text,
            speed: 1.0, // Ensure natural speed
        });

        // Stream the response directly
        return new NextResponse(mp3.body, {
            headers: {
                "Content-Type": "audio/mpeg",
                "Transfer-Encoding": "chunked",
            },
        });

    } catch (error) {
        console.error("Error in speak API:", error);
        return NextResponse.json(
            { error: "Failed to generate speech" },
            { status: 500 }
        );
    }
}
