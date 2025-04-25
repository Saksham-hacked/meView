import express from 'express';
const app = express();
import cookieParser from 'cookie-parser';
import cors from 'cors';

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true, }));
app.use(express.static('public'));
app.use(cookieParser());


import userRouter from './routes/user.routes.js';
import reviewRouter from './routes/review.routes.js';

app.use("/user",userRouter);
app.use("/review", reviewRouter);


export default app;