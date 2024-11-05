import express from "express";
import {
  test,
  updateUser,
  deleteUser,
  getUserMeals,
  getUserPlanners,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/meals/:id", verifyToken, getUserMeals);
router.get("/planners/:id", verifyToken, getUserPlanners);

export default router;
