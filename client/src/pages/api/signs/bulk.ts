import type { NextApiRequest, NextApiResponse } from "next";
import { createManyWords } from '@/utils/queries/sign';
import { dbConnect } from "@/utils/mongodb";
import { ISign } from "@/utils/models/Sign";

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const signs = req.body;
    await dbConnect();
    await createManyWords(signs);
    res.status(201).json({message: 'Signs added'});
  } catch (error) {
    console.log(error);
    res.status(500).json({error: (error as Error).message});
  } 
}
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST')
    return POST(req, res);
  res.status(404).json({error: 'Invalid Method'}); 
}
