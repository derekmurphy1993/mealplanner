import express from "express";
import {
  createPlanner,
  getMyPlanners,
  deletePlanner,
  updatePlanner,
  getPlanner,
} from "../controllers/planner.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/", verifyToken, createPlanner);
router.get("/", verifyToken, getMyPlanners);

router.get("/:id", verifyToken, getPlanner);
router.put("/:id", verifyToken, updatePlanner);
router.delete("/:id", verifyToken, deletePlanner);

export default router;
