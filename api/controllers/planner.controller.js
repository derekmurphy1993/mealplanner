import Planner from "../models/planner.model.js";
import { errorHandler } from "../utils/error.js";

const toNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

const getDailyTotals = (meals = []) =>
  meals.reduce(
    (totals, meal) => ({
      calories: totals.calories + toNumber(meal?.calories),
      carbs: totals.carbs + toNumber(meal?.carbs),
      prots: totals.prots + toNumber(meal?.prots),
      fats: totals.fats + toNumber(meal?.fats),
    }),
    { calories: 0, carbs: 0, prots: 0, fats: 0 }
  );

const plannerWithTotals = (plannerDoc) => {
  if (!plannerDoc) return plannerDoc;
  const planner = plannerDoc.toObject ? plannerDoc.toObject() : plannerDoc;
  const weekWithTotals = (planner.week || []).map((day) => ({
    ...day,
    dailyTotals: getDailyTotals(day.meals || []),
  }));
  return { ...planner, week: weekWithTotals };
};

const parsePlannerLength = (value) => {
  const length = Number(value);
  return [5, 7].includes(length) ? length : null;
};

export const createPlanner = async (req, res, next) => {
  try {
    const plannerLength = parsePlannerLength(req.body.plannerLength) || 5;
    const week = Array.isArray(req.body.week)
      ? req.body.week
      : Planner.defaultWeekForLength(plannerLength);

    const planner = await Planner.create({
      plannerLength,
      week,
      userRef: req.user.id,
    });
    const populated = await Planner.findById(planner._id).populate("week.meals");
    return res.status(201).json(plannerWithTotals(populated));
  } catch (error) {
    next(error);
  }
};

export const getMyPlanners = async (req, res, next) => {
  try {
    const planners = await Planner.find({ userRef: req.user.id })
      .sort({ createdAt: -1 })
      .populate("week.meals");
    return res.status(200).json(planners.map(plannerWithTotals));
  } catch (error) {
    next(error);
  }
};

export const deletePlanner = async (req, res, next) => {
  try {
    const planner = await Planner.findById(req.params.id);
    if (!planner) {
      return next(errorHandler(404, "Planner not found."));
    }
    if (req.user.id !== planner.userRef) {
      return next(
        errorHandler(401, "You cannot delete a planner you do not own.")
      );
    }
    await Planner.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Planner has been deleted" });
  } catch (error) {
    next(error);
  }
};

export const updatePlanner = async (req, res, next) => {
  try {
    const planner = await Planner.findById(req.params.id);
    if (!planner) {
      return next(errorHandler(404, "Planner not found."));
    }
    if (req.user.id !== planner.userRef.toString()) {
      return next(errorHandler(401, "You cannot edit a planner you do not own."));
    }

    const plannerLength =
      parsePlannerLength(req.body.plannerLength) || planner.plannerLength;
    const week = Array.isArray(req.body.week)
      ? req.body.week
      : req.body.plannerLength
      ? Planner.defaultWeekForLength(plannerLength)
      : planner.week;

    const updated = await Planner.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        plannerLength,
        week,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    const populated = await Planner.findById(updated._id).populate("week.meals");
    return res.status(200).json(plannerWithTotals(populated));
  } catch (error) {
    next(error);
  }
};

export const getPlanner = async (req, res, next) => {
  try {
    const planner = await Planner.findById(req.params.id).populate("week.meals");
    if (!planner) {
      return next(errorHandler(404, "Planner not found"));
    }
    if (req.user.id !== planner.userRef.toString()) {
      return next(errorHandler(401, "You can only view your own planner."));
    }
    return res.status(200).json(plannerWithTotals(planner));
  } catch (error) {
    next(error);
  }
};
