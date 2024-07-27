import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDatabase } from "./Database/db";

/* Backend server initialised */
const app = express();

/* To use .env variables throughout our code */
dotenv.config({ path: "./.env" });

/* Allow cross-origin requests from specified origin and include credentials (cookies, authorization headers, etc.) */
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

/* Parse incoming requests with JSON payloads*/
app.use(express.json());

/* Connected the database */
connectDatabase().then(() => {
  console.log("Database connected successfully!");
});

/* Parse Cookie header and populate req.cookies with an object keyed by the cookie names*/
app.use(cookieParser());

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running at: http://localhost:${port}`);
});

/* HealthCheck route */
app.get("/", (req, res) => {
  res.send("Meet AI backend!");
});

import userRouter from "./routes/user.routes";

/* user Routes */
app.use('/api/v1/user',userRouter)