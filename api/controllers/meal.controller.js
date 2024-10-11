import Meal from "../models/meal.model.js";
import { errorHandler } from "../utils/error.js";

export const createMeal = async (req, res, next) => {
  try {
    const meal = await Meal.create(req.body);
    return res.status(201).json(meal);
  } catch (error) {
    next(error);
  }
};

export const deleteMeal = async (req, res, next) => {
  const meal = await Meal.findById(req.params.id);

  if (!meal) {
    return next(errorHandler(404, "Item not found."));
  }
  if (req.user.id !== meal.userRef) {
    return next(errorHandler(401, "You cannot delete an item you do not own."));
  }
  try {
    await Meal.findByIdAndDelete(req.params.id);
    res.status(200).json(`Meal has been deleted`);
  } catch (error) {
    next(error);
  }
};

export const updateMeal = async (req, res, next) => {
  const meal = Meal.findById(req.params.id);
  if (!meal) {
    return next(errorHandler(404, "Item not found."));
  }
  //   if (req.user.id !== meal.userRef.toString()) {
  //     return next(errorHandler(401, "You cannot edit an item you do not own."));
  //   }

  try {
    const updateMeal = await Meal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updateMeal);
  } catch (error) {}
};

export const getMeal = async (req, res, next) => {
  try {
    const meal = await Meal.findById(req.params.id);
    if (!meal) {
      return next(errorHandler(404, "Item not found"));
    }
    res.status(200).json(meal);
  } catch (error) {
    next(error);
  }
};
