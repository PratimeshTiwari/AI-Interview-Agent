import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Session from "@/models/Session";

export async function GET(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "UserId is required" }, { status: 400 });
        }

        const sessions = await Session.find({ userId }).sort({ createdAt: -1 });
        return NextResponse.json(sessions);
    } catch (error) {
        console.error("Error fetching history:", error);
        return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();

        const session = await Session.create(body);
        return NextResponse.json(session);
    } catch (error) {
        console.error("Error saving session:", error);
        return NextResponse.json({ error: "Failed to save session" }, { status: 500 });
    }
}
