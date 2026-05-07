import express from 'express';
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
<<<<<<< Updated upstream
import hourRoutes from "./routes/hourRoutes.js";
=======
import hoursRoutes from "./routes/hourRoutes.js";
import prisma from './lib/prisma.js';
>>>>>>> Stashed changes

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);
app.use('/activities', activityRoutes);
<<<<<<< Updated upstream
app.use('/hours', hourRoutes);
=======
app.use('/hours', hoursRoutes);

app.get("/test-db", async (req, res) => {
    try{
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json("Failed to fetch users");
    }
})
>>>>>>> Stashed changes

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})