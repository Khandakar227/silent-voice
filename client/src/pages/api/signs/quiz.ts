import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/utils/mongodb";
import { getRandom4Words } from "@/utils/queries/sign";

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        await dbConnect();
        const data = await getRandom4Words();
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: (error as Error).message });
    }
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method === 'GET')
        return GET(req, res);
    res.status(404).json({ error: 'Invalid Method' });
}