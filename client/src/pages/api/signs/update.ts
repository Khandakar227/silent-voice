import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/utils/mongodb";
import { updateWordById, getWordByWord } from "@/utils/queries/sign";
import { ISign } from "@/utils/models/Sign";

const PUT = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        await dbConnect();
        const { oldWord, newWord, videos, images } = req.body;

        if (!newWord && !videos && !images) {
            return res.status(400).json({ error: "Invalid input" });
        }

        const existingWord = await getWordByWord(oldWord);
        if (!existingWord) {
            return res.status(404).json({ error: 'Word not found' });
        }

        const sign = {
            word: newWord || existingWord.word,
            videos: videos || existingWord.videos,
            images: images || existingWord.images,
        };

        const updatedSign = await updateWordById(existingWord._id, sign as ISign);

        if (!updatedSign) {
            return res.status(500).json({ error: 'Failed to update word' });
        }

        res.status(200).json(updatedSign);
    } catch (error) {
        console.error('Error in update word API:', error);
        res.status(500).json({ error: 'Internal Server Error', details: (error as Error).message });
    }
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method === 'PUT') {
        return PUT(req, res);
    }
    res.status(405).json({ error: 'Method Not Allowed' });
}