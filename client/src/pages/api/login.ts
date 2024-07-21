import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/utils/mongodb";
import { login } from "@/utils/auth";


const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { email, password } = req.body;
    await dbConnect();
    const data = await login(email, password);

    res.status(201).json({ message: 'Logged in successfully', data });
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
