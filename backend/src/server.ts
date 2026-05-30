import express from 'express';
import cors from "cors";

import activityRoutes from "./routes/activityRoutes.js";
import hoursRoutes from "./routes/timeRoutes.js";
import authRoutes from './routes/authRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/activities', activityRoutes);
app.use('/api/time-entries', hoursRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})