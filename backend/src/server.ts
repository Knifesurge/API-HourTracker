import express from 'express';
import cors from "cors";

import userRoutes from "./routes/userRoutes";
import prisma from './lib/prisma.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);

app.get("/test-db", async (req, res) => {
    try{
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json("Failed to fetch users");
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})