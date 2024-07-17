import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/utils/mongodb";
import { deleteWordById } from "@/utils/queries/sign";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        await dbConnect();
        const { wordId } = req.body;

        if (!wordId) {
            return res.status(400).json({ error: 'Word is required' });
        }

        const deletedWord = await deleteWordById(wordId);

        if (!deletedWord) {
            return res.status(404).json({ error: 'Word not found' });
        }

        res.status(200).json({ message: 'Word deleted successfully' });
    } catch (error) {
        console.error('Error deleting word:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}