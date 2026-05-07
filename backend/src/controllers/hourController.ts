import type { Request, Response } from 'express';
import prisma from '../lib/prisma.js';

const getAllHours = async (req: Request, res: Response) => {
    try {
        const hours = await prisma.timeEntry.findMany();
        return res.json(hours);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to fetch hours" });
    }
}

export {
    getAllHours
};