import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/utils/mongodb";
import { getAdminByEmail } from "@/utils/queries/admin";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    console.log('API route hit:', req.method, req.url);
    console.log('Request body:', req.body);

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        await dbConnect();

        const admin = await getAdminByEmail(email);
        console.log('Admin fetch result:', admin);

        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        res.status(200).json({ message: 'Logged in successfully' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal Server Error', details: (error as Error).message });
    }
}