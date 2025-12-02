import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
    userId: string;
    role: string;
    messages: any[];
    score: number;
    summary: string;
    strengths: string[];
    weaknesses: string[];
    createdAt: Date;
}

const SessionSchema: Schema = new Schema({
    userId: { type: String, required: true, index: true },
    role: { type: String, required: true },
    messages: { type: Array, default: [] },
    score: { type: Number, default: 0 },
    summary: { type: String, default: "" },
    strengths: { type: [String], default: [] },
    weaknesses: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema);
