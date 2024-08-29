import express from "express";
import { createMeal } from "../controllers/meal.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createMeal);

export default router;
