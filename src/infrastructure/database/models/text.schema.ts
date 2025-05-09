import { Schema, Document } from "mongoose";

export interface TextDocument extends Document {
    content: string;
    createdBy: string;
    createdAt: Date;
}

export const textSchema = new Schema<TextDocument>({
    content: { 
        type: String, 
        required: true 
    },
    createdBy: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
}, {
    timestamps: true,
})