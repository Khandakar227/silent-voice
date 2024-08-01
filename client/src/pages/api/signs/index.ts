import type { NextApiRequest, NextApiResponse } from "next";
import { createWord, deleteWordById, getAllWords, getWordStartingWith } from '@/utils/queries/sign';
import { dbConnect } from "@/utils/mongodb";
import { ISign } from "@/utils/models/Sign";
import { getProfile } from "@/utils/auth";

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { limit, page, prefix } = req.query;
    await dbConnect();
    if (!prefix) {
      const data = await getAllWords(page ? +page : 1, limit ? +limit : 20);
      res.status(200).json(data);
    } else {
      const data = await getWordStartingWith(prefix as string, page ? +page : 1, limit ? +limit : 20);
      res.status(200).json(data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: (error as Error).message });
  }
}

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { word, videos } = req.body;
    await dbConnect();

    const token = req.headers.authorization && req.headers.authorization.slice(7);
    if(!token) return res.status(401).json({error: "Missing token"})
    const user:any = await getProfile(token as string);
    if(!user || user.role != 'admin') return res.status(401).json({error: "Unauthorized"});

    const sign = await createWord({ word, videos } as ISign);
    res.status(201).json(sign);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: (error as Error).message });
  }
}

const DELETE = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await dbConnect();

    const { wordId } = req.body;
    if (!wordId)  return res.status(400).json({ error: 'Word is required' });

    const token = req.headers.authorization && req.headers.authorization.slice(7);
    if(!token) return res.status(401).json({error: "Missing token"})
    const user:any = await getProfile(token as string);
    if(!user || user.role != 'admin') return res.status(401).json({error: "Unauthorized"});

    const deletedWord = await deleteWordById(wordId);

    if (!deletedWord) return res.status(404).json({ error: 'Word not found' });

    res.status(200).json({ message: 'Word deleted successfully' });
  } catch (error) {
    console.error('Error deleting word:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET')
    return GET(req, res);
  if (req.method === 'POST')
    return POST(req, res);
  if (req.method === 'DELETE')
    return DELETE(req, res);

  res.status(404).json({ error: 'Invalid Method' });
}
