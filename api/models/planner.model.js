import mongoose from "mongoose";
import mealSchema from "./meal.model.js";

const DayColumnSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    required: true,
  },
  meals: [],
});

const PlannerSchema = new mongoose.Schema(
  {
    week: [DayColumnSchema],
    userRef: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Planner = mongoose.model("Planner", PlannerSchema);

export default Planner;
