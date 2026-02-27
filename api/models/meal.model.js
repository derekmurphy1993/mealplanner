import mongoose from "mongoose";

const isValidMacroNumber = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string" && value.trim() === "") return false;
  const numberValue = Number(value);
  return Number.isFinite(numberValue);
};

const computeCompletedMacros = (meal) =>
  ["calories", "carbs", "fats", "prots"].every((key) =>
    isValidMacroNumber(meal?.[key])
  );

const recipeSchema = new mongoose.Schema({
  url: { type: String },
  steps: [{ type: String }],
  ingredients: [
    {
      itemName: { type: String },
      itemAmount: { type: Number },
      itemUnit: { type: String },
    },
  ],
});

const mealSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    calories: {
      type: Number,
      default: null,
    },
    carbs: {
      type: Number,
      default: null,
    },
    fats: {
      type: Number,
      default: null,
    },
    prots: {
      type: Number,
      default: null,
    },
    completedMacros: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
    },
    recipe: {
      type: recipeSchema,
    },
    userRef: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

mealSchema.pre("save", function (next) {
  const macrosComplete = computeCompletedMacros(this);
  this.completedMacros = macrosComplete;
  next();
});

mealSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() || {};
  const set = update.$set || {};
  const current = await this.model.findOne(this.getQuery()).lean();
  const merged = { ...(current || {}), ...update, ...set };
  const macrosComplete = computeCompletedMacros(merged);

  if (update.$set) {
    update.$set.completedMacros = macrosComplete;
  } else {
    update.completedMacros = macrosComplete;
  }

  this.setUpdate(update);
  next();
});

const Meal = mongoose.model("Meal", mealSchema);

export default Meal;
