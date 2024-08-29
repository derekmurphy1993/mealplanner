import Meal from "../models/meal.model.js";

export const createMeal = async (req, res, next) => {
	try {
		const meal = await Meal.create(req.body);
		return res.status(201).json(meal);
	} catch (error) {
		next(error);
	}
};
