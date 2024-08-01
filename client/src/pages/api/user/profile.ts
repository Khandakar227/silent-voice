import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/utils/mongodb";
import { getProfile } from "@/utils/auth";
import { json } from "stream/consumers";

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        await dbConnect();
        const token = req.headers.authorization && req.headers.authorization.slice(7);
        if(!token)
            return res.status(401).json({error: "Missing token"})
        console.log(token);
        const user = await getProfile(token as string);
        res.status(200).json({ user });
    } catch (error) {
        console.log(error);
        res.status(403).json({error: (error as Error).message});
    }
}


export default function handler(
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    if (req.method === 'GET')
      return GET(req, res);
    res.status(404).json({error: 'Invalid Method'}); 
  }
  