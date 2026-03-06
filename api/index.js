import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import mealRouter from "./routes/meal.route.js";
import plannerRouter from "./routes/planner.route.js";
import cookieParser from "cookie-parser";
import { createRateLimiter } from "./utils/rateLimit.js";
dotenv.config();

const app = express();

app.set("trust proxy", 1);

const globalLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: "Too many requests. Please try again shortly.",
});

const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many authentication attempts. Please try again later.",
});

app.use(globalLimiter);
app.use(express.json({ limit: "200kb" }));
app.use(express.urlencoded({ extended: true, limit: "200kb" }));

app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/auth", authLimiter, authRouter);
app.use("/api/meal", mealRouter);
app.use("/api/planner", plannerRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("connected to DB");
    app.listen(PORT, () => {
      console.log(`Server Running on port ${PORT}`);
    });
  } catch (err) {
    console.error("error connecting to db", err);
    process.exit(1);
  }
}

startServer();
