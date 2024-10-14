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
  const meal = await Meal.findById(req.params.id);
  if (!meal) {
    return next(errorHandler(404, "Item not found."));
  }
  if (req.user.id !== meal.userRef.toString()) {
    return next(errorHandler(401, "You cannot edit an item you do not own."));
  }

  try {
    const updateMeal = await Meal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updateMeal);
  } catch (error) {
    next(error);
  }
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

export const searchMeals = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";

    const meals = await Meal.find({
      name: { $regex: searchTerm, $options: "i" },
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(meals);
  } catch (error) {
    next(error);
  }
};
