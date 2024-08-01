import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/utils/mongodb";
import { getWordByWord, updateWordByWord } from "@/utils/queries/sign";
import { getProfile } from "@/utils/auth";

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        await dbConnect();
        const { word } = req.query;
        const data = await getWordByWord(word as string);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: (error as Error).message });
    }
}

const PUT = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        await dbConnect();
        const { word } = req.query;
        const {word: newWord, videos} = req.body;
        
        const token = req.headers.authorization && req.headers.authorization.slice(7);
        if(!token) return res.status(401).json({error: "Missing token"})
        const user:any = await getProfile(token as string);
        if(!user || user.role != 'admin') return res.status(401).json({error: "Unauthorized"});

        const data = await updateWordByWord(word as string, { word:newWord, videos  });
        res.status(200).json(data);    
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: (error as Error).message });
    }
}

export default function handler( req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET')
        return GET(req, res);
    if (req.method === 'PUT')
        return PUT(req, res);

    return res.status(404).json({ error: 'Invalid Method' });
}