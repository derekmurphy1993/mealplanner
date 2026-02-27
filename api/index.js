import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import mealRouter from "./routes/meal.route.js";
import plannerRouter from "./routes/planner.route.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();

app.use(express.json());

app.use(cookieParser());

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
