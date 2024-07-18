import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/utils/mongodb";
import { createWord, getWordByWord } from "@/utils/queries/sign";
import { ISign } from "@/utils/models/Sign";

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        await dbConnect();
        const { word, videos, images } = req.body;

        if (!word || !Array.isArray(videos) || !Array.isArray(images)) {
            return res.status(400).json({ error: "Invalid input. Word is required, and videos and images must be arrays." });
        }

        const existingWord = await getWordByWord(word);
        if (existingWord) {
            return res.status(409).json({ error: 'Word already exists' });
        }

        const newSign = {
            word,
            videos: videos.filter((v: string) => v.trim() !== ""),
            images: images.filter((i: string) => i.trim() !== ""),
        };

        const createdSign = await createWord(newSign as ISign);

        if (!createdSign) {
            return res.status(500).json({ error: 'Failed to create word' });
        }

        res.status(201).json(createdSign);
    } catch (error) {
        console.error('Error in create word API:', error);
        res.status(500).json({ error: 'Internal Server Error', details: (error as Error).message });
    }
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method === 'POST') {
        return POST(req, res);
    }
    res.status(405).json({ error: 'Method Not Allowed' });
}