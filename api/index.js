import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import mealRouter from "./routes/meal.route.js";
import plannerRouter from "./routes/planner.route.js";
import cookieParser from "cookie-parser";
dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(console.log("connected to DB"))
  .catch("error connecting to db");
const app = express();

app.use(express.json());

app.use(cookieParser());

app.listen(3000, () => {
  console.log(`Server Running on port 3000`);
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
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
