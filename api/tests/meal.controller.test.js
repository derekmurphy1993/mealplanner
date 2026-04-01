import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../models/meal.model.js", () => ({
  default: {
    create: vi.fn(),
    find: vi.fn(),
  },
}));

import Meal from "../models/meal.model.js";
import { createMeal, searchMeals } from "../controllers/meal.controller.js";

const createResponse = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe("meal controller smoke tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a meal with normalized tags and completed macro state", async () => {
    const req = {
      user: { id: "user-123" },
      body: {
        name: "Turkey Chili",
        mealTags: ["dinner", "vegetarian", "dinner", "invalid"],
        calories: 400,
        carbs: 30,
        fats: 12,
        prots: 35,
      },
    };
    const res = createResponse();
    const next = vi.fn();

    Meal.create.mockResolvedValue({
      _id: "meal-123",
      name: "Turkey Chili",
      mealTags: ["dinner", "vegetarian"],
      completedMacros: true,
      userRef: "user-123",
    });

    await createMeal(req, res, next);

    expect(Meal.create).toHaveBeenCalledWith({
      ...req.body,
      mealTags: ["dinner", "vegetarian"],
      userRef: "user-123",
      isPublic: false,
      completedMacros: true,
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: "meal-123",
        completedMacros: true,
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("searches meals using normalized filters and sort values", async () => {
    const sortChain = {
      limit: vi.fn(),
    };
    const limitChain = {
      skip: vi.fn().mockResolvedValue([{ _id: "meal-123", name: "Oats" }]),
    };

    sortChain.limit.mockReturnValue(limitChain);
    Meal.find.mockReturnValue({
      sort: vi.fn().mockReturnValue(sortChain),
    });

    const req = {
      user: { id: "user-123" },
      query: {
        searchTerm: "oa",
        mealTags: "breakfast,invalid",
        sort: "calories",
        order: "asc",
        limit: "5",
        startIndex: "2",
        includePublic: "true",
      },
    };
    const res = createResponse();
    const next = vi.fn();

    await searchMeals(req, res, next);

    expect(Meal.find).toHaveBeenCalledWith({
      $or: [{ userRef: "user-123" }, { isPublic: true }],
      name: { $regex: "oa", $options: "i" },
      mealTags: { $in: ["breakfast"] },
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ _id: "meal-123", name: "Oats" }]);
    expect(next).not.toHaveBeenCalled();
  });
});
