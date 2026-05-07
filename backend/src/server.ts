import express from 'express';
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import hourRoutes from "./routes/hourRoutes.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);
app.use('/activities', activityRoutes);
app.use('/hours', hourRoutes);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})