import mongoose, { Schema, Document } from 'mongoose';

export interface IMemory extends Document {
    userId: string;
    text: string;
    type: 'skill' | 'experience' | 'preference' | 'weakness';
    createdAt: Date;
}

const MemorySchema: Schema = new Schema({
    userId: { type: String, required: true, index: true },
    text: { type: String, required: true },
    type: {
        type: String,
        enum: ['skill', 'experience', 'preference', 'weakness'],
        required: true
    },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Memory || mongoose.model<IMemory>('Memory', MemorySchema);
