import type { NextApiRequest, NextApiResponse } from "next";
import { createWord, getAllWords, getWordStartingWith } from '@/utils/queries/sign';
import { dbConnect } from "@/utils/mongodb";
import { ISign } from "@/utils/models/Sign";

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {limit, page, prefix} = req.query;
    await dbConnect();
    if(!prefix) {
        const data = await getAllWords(page ? +page : 1, limit ? +limit : 20);
        res.status(200).json(data);
    } else {
        const data = await getWordStartingWith(prefix as string, page ? +page : 1, limit ? +limit : 20);
        res.status(200).json(data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({error: (error as Error).message});
  } 
}

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { word, videos } = req.body;
    await dbConnect();
    const sign = await createWord({ word, videos } as ISign);
    res.status(201).json(sign);
  } catch (error) {
    console.log(error);
    res.status(500).json({error: (error as Error).message});
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
  res.status(404).json({error: 'Invalid Method'}); 
}
