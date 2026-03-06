import Meal from "../models/meal.model.js";
import { errorHandler } from "../utils/error.js";

const MEAL_TAG_OPTIONS = [
  "breakfast",
  "lunch",
  "dinner",
  "snack",
  "vegetarian",
];

const MEAL_TAG_SET = new Set(MEAL_TAG_OPTIONS);

const isValidMacroNumber = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string" && value.trim() === "") return false;
  return Number.isFinite(Number(value));
};

const computeCompletedMacros = (source) =>
  ["calories", "carbs", "fats", "prots"].every((key) =>
    isValidMacroNumber(source?.[key])
  );

const parseBooleanQuery = (value) =>
  value === true || value === "true" || value === "1";

const parseSortField = (sort) => {
  if (!sort || sort === "latest") return "createdAt";
  const allowedSorts = new Set(["createdAt", "calories", "prots", "carbs", "fats"]);
  return allowedSorts.has(sort) ? sort : "createdAt";
};

const parseSortOrder = (order) => (order === "asc" ? "asc" : "desc");

const normalizeMealTags = (value) => {
  if (!value) return [];

  const asArray = Array.isArray(value)
    ? value
    : String(value)
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

  return [...new Set(asArray.filter((tag) => MEAL_TAG_SET.has(tag)))];
};

export const createMeal = async (req, res, next) => {
  try {
    const mealTags = normalizeMealTags(req.body.mealTags);
    const meal = await Meal.create({
      ...req.body,
      mealTags,
      userRef: req.user.id,
      isPublic: false,
      completedMacros: computeCompletedMacros(req.body),
    });
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
    return res.status(200).json(`Meal has been deleted`);
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
    const mealTags = normalizeMealTags(req.body.mealTags ?? meal.mealTags);
    const nextMacroState = {
      calories: req.body.calories ?? meal.calories,
      carbs: req.body.carbs ?? meal.carbs,
      fats: req.body.fats ?? meal.fats,
      prots: req.body.prots ?? meal.prots,
    };
    const completedMacros = computeCompletedMacros(nextMacroState);
    const updateMeal = await Meal.findByIdAndUpdate(
      req.params.id,
      { ...req.body, mealTags, isPublic: meal.isPublic, completedMacros },
      {
        new: true,
      }
    );
    res.status(200).json(updateMeal);
  } catch (error) {
    next(error);
  }
};

export const getMeal = async (req, res, next) => {
  try {
    const includePublic = parseBooleanQuery(req.query.includePublic);
    const visibilityFilter = includePublic
      ? { $or: [{ userRef: req.user.id }, { isPublic: true }] }
      : { userRef: req.user.id };
    const meal = await Meal.findOne({
      _id: req.params.id,
      ...visibilityFilter,
    });
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

    const sort = parseSortField(req.query.sort);
    const order = parseSortOrder(req.query.order);
    const includePublic = parseBooleanQuery(req.query.includePublic);
    const mealTags = normalizeMealTags(req.query.mealTags);
    const visibilityFilter = includePublic
      ? { $or: [{ userRef: req.user.id }, { isPublic: true }] }
      : { userRef: req.user.id };

    const meals = await Meal.find({
      ...visibilityFilter,
      name: { $regex: searchTerm, $options: "i" },
      ...(mealTags.length > 0 ? { mealTags: { $in: mealTags } } : {}),
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(meals);
  } catch (error) {
    next(error);
  }
};

export const getPublicMeal = async (req, res, next) => {
  try {
    const meal = await Meal.findOne({ _id: req.params.id, isPublic: true });
    if (!meal) {
      return next(errorHandler(404, "Item not found"));
    }
    res.status(200).json(meal);
  } catch (error) {
    next(error);
  }
};

export const searchPublicMeals = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    const searchTerm = req.query.searchTerm || "";

    const sort = parseSortField(req.query.sort);
    const order = parseSortOrder(req.query.order);
    const mealTags = normalizeMealTags(req.query.mealTags);

    const meals = await Meal.find({
      isPublic: true,
      name: { $regex: searchTerm, $options: "i" },
      ...(mealTags.length > 0 ? { mealTags: { $in: mealTags } } : {}),
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(meals);
  } catch (error) {
    next(error);
  }
};
