import express from "express";
import {
  createMeal,
  deleteMeal,
  updateMeal,
  getMeal,
  getPublicMeal,
  searchMeals,
  searchPublicMeals,
} from "../controllers/meal.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import { createRateLimiter } from "../utils/rateLimit.js";

const router = express.Router();
const mealSearchLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000,
  max: 60,
  message: "Too many meal search requests. Please try again soon.",
});

router.post("/create", verifyToken, createMeal);
router.delete("/delete/:id", verifyToken, deleteMeal);
router.post("/update/:id", verifyToken, updateMeal);
router.get("/get/:id", verifyToken, getMeal);
router.get(`/search`, mealSearchLimiter, verifyToken, searchMeals);
router.get("/public/search", mealSearchLimiter, searchPublicMeals);
router.get("/public/:id", getPublicMeal);

export default router;
