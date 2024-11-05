import Planner from "../models/planner.model.js";

import { errorHandler } from "../utils/error.js";

export const createPlanner = async (req, res, next) => {
  try {
    const planner = await Planner.create(req.body);
    return res.status(201).json(planner);
  } catch (error) {
    next(error);
  }
};

export const deletePlanner = async (req, res, next) => {
  const planner = await Planner.findById(req.params.id);

  if (!planner) {
    return next(errorHandler(404, "Item not found."));
  }
  if (req.user.id !== planner.userRef) {
    return next(errorHandler(401, "You cannot delete an item you do not own."));
  }
  try {
    await Planner.findByIdAndDelete(req.params.id);
    return res.status(200).json(`Planner has been deleted`);
  } catch (error) {
    next(error);
  }
};

export const updatePlanner = async (req, res, next) => {
  const planner = await Planner.findById(req.params.id);
  if (!planner) {
    return next(errorHandler(404, "Item not found."));
  }
  if (req.user.id !== planner.userRef.toString()) {
    return next(errorHandler(401, "You cannot edit an item you do not own."));
  }

  try {
    const updatePlanner = await Planner.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json(updatePlanner);
  } catch (error) {
    next(error);
  }
};

export const getPlanner = async (req, res, next) => {
  try {
    const planner = await Planner.findById(req.params.id);
    if (!planner) {
      return next(errorHandler(404, "Item not found"));
    }
    res.status(200).json(planner);
  } catch (error) {
    next(error);
  }
};
