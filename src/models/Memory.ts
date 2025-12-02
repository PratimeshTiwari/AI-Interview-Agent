import mongoose, { Schema, Document } from 'mongoose';

export interface IMemory extends Document {
    userId: string;
    text: string;
    type: 'fact' | 'preference' | 'summary' | 'experience' | 'skill' | 'weakness';
    createdAt: Date;
}

const MemorySchema: Schema = new Schema({
    userId: { type: String, required: true, index: true },
    text: { type: String, required: true },
    type: {
        type: String,
        enum: ['fact', 'preference', 'summary', 'experience', 'skill', 'weakness'],
        required: true
    },
    embedding: { type: [Number], index: true }, // Vector embedding for RAG
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Memory || mongoose.model<IMemory>('Memory', MemorySchema);
