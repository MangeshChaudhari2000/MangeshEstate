import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from './routes/listing.route.js';
import bodyParser from "body-parser"
import cors from "cors";
import Stripe from "stripe";
import path from 'path';
mongoose.connect(process.env.MONGO).then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log("error connecting to mongoDB: ", err.message);
})

const __direname = path.resolve();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.listen(3000, () => {
    console.log("Server is running on port 3000!");
})

app.get("/test", (req, res) => {
    res.send("Hello World")
})

app.use("/api/user", userRouter)
app.use("/api/auth", authRouter)
app.use("/api/listing", listingRouter)

app.use(express.static(path.join(__direname, '/client/dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__direname, 'client', 'dist', 'index.html'))
})
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})


