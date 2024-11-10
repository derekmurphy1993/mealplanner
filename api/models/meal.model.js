import mongoose from "mongoose";

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
      required: true,
    },
    carbs: {
      type: Number,
    },
    fats: {
      type: Number,
    },
    prots: {
      type: Number,
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

const Meal = mongoose.model("Meal", mealSchema);

export default Meal;
