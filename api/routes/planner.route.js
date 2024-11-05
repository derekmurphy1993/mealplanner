import express from "express";
import {
  createPlanner,
  deletePlanner,
  updatePlanner,
  getPlanner,
} from "../controllers/planner.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", createPlanner);
router.delete("/delete/:id", verifyToken, deletePlanner);
router.post("/update/:id", verifyToken, updatePlanner);
router.get("/get/:id", verifyToken, getPlanner);

export default router;
