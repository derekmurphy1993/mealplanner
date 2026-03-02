import mongoose from "mongoose";

const DAYS_5 = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const DAYS_7 = [...DAYS_5, "Saturday", "Sunday"];

const goalsSchema = new mongoose.Schema(
  {
    calories: { type: Number },
    carbs: { type: Number },
    prots: { type: Number },
    fats: { type: Number },
  },
  { _id: false }
);

const daySchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: DAYS_7,
      required: true,
    },
    meals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Meal",
      },
    ],
    dailyGoals: {
      type: goalsSchema,
      default: undefined,
    },
  },
  { _id: false }
);

const PlannerSchema = new mongoose.Schema(
  {
    plannerLength: {
      type: Number,
      enum: [5, 7],
      required: true,
    },
    week: {
      type: [daySchema],
      required: true,
      validate: {
        validator: function (weekValue) {
          if (!Array.isArray(weekValue)) return false;
          if (![5, 7].includes(this.plannerLength)) return false;
          if (weekValue.length !== this.plannerLength) return false;

          const expectedDays = this.plannerLength === 5 ? DAYS_5 : DAYS_7;
          const actualDays = weekValue.map((d) => d?.day);

          return (
            expectedDays.length === actualDays.length &&
            expectedDays.every((day, index) => day === actualDays[index])
          );
        },
        message:
          "Week must match plannerLength and use ordered day names (Mon-Fri or Mon-Sun).",
      },
    },
    userRef: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

PlannerSchema.statics.defaultWeekForLength = function (plannerLength) {
  const days = plannerLength === 7 ? DAYS_7 : DAYS_5;
  return days.map((day) => ({ day, meals: [] }));
};

const Planner = mongoose.model("Planner", PlannerSchema);

export default Planner;
