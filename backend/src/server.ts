import express from 'express';
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import hoursRoutes from "./routes/timeRoutes.js";
import authRoutes from './routes/authRoutes.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/activities', activityRoutes);
app.use('/api/time-entries', hoursRoutes);
app.use('/api/auth', authRoutes);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})