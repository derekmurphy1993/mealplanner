import express from "express";
import {
  createMeal,
  deleteMeal,
  updateMeal,
  getMeal,
} from "../controllers/meal.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createMeal);
router.delete("/delete/:id", verifyToken, deleteMeal);
router.post("/update/:id", verifyToken, updateMeal);
router.get("/get/:id", getMeal);

export default router;
