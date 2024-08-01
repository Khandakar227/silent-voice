import mongoose, { Document, model, Model, models, Schema } from 'mongoose';

export interface ISign {
    word: string,
    videos: string[],
    images?: string[],
}

export const signSchema: Schema = new Schema({
    word: { type: String, required: true, index: true, unique: true },
    videos: [{ type: String }],
    images: [{ type: String }],
});

const Sign = models.sign ?? model("sign", signSchema);

export default Sign;