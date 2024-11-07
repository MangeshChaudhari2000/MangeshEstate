import dotenv from "dotenv";
dotenv.config();
console.log(process.env.MONGO);

import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from './routes/listing.route.js'
mongoose.connect(process.env.MONGO).then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log("error connecting to mongoDB: ", err.message);
})

const _direname = path.resolve();
const app = express();

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

app.use(express.static(pah.join(__dirname, '/client/dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'))
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


