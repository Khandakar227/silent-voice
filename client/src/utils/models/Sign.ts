import mongoose, { model, Model, models, Schema } from 'mongoose';

export interface ISign {
    word: string,
    videos: string[],
    images: string[],
}

export const SignSchema: Schema = new Schema({
    word: { type: String, required: true, index: true, unique: true },
    videos: [{ type: String, required: true }],
    images: [{ type: String, required: true }],
});

const Sign = models.Sign || model("sign", SignSchema);

export default Sign;