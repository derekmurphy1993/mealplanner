import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../models/planner.model.js", () => ({
  default: {
    countDocuments: vi.fn(),
    create: vi.fn(),
    findById: vi.fn(),
    defaultWeekForLength: vi.fn(),
  },
}));

import Planner from "../models/planner.model.js";
import { createPlanner } from "../controllers/planner.controller.js";

const createResponse = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe("planner controller smoke tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a planner with a generated name and computed day totals", async () => {
    const req = {
      user: { id: "user-123" },
      body: {
        plannerLength: 5,
      },
    };
    const res = createResponse();
    const next = vi.fn();

    const defaultWeek = [
      { day: "Monday", meals: [] },
      { day: "Tuesday", meals: [] },
      { day: "Wednesday", meals: [] },
      { day: "Thursday", meals: [] },
      { day: "Friday", meals: [] },
    ];

    Planner.countDocuments.mockResolvedValue(2);
    Planner.defaultWeekForLength.mockReturnValue(defaultWeek);
    Planner.create.mockResolvedValue({ _id: "planner-123" });
    Planner.findById.mockReturnValue({
      populate: vi.fn().mockResolvedValue({
        toObject: () => ({
          _id: "planner-123",
          name: "Week 3",
          plannerLength: 5,
          userRef: "user-123",
          week: [
            {
              day: "Monday",
              meals: [
                { calories: 300, carbs: 20, prots: 10, fats: 5 },
                { calories: 200, carbs: 15, prots: 8, fats: 3 },
              ],
            },
            ...defaultWeek.slice(1),
          ],
        }),
      }),
    });

    await createPlanner(req, res, next);

    expect(Planner.defaultWeekForLength).toHaveBeenCalledWith(5);
    expect(Planner.create).toHaveBeenCalledWith({
      name: "Week 3",
      plannerLength: 5,
      week: defaultWeek,
      userRef: "user-123",
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Week 3",
        week: expect.arrayContaining([
          expect.objectContaining({
            day: "Monday",
            dailyTotals: {
              calories: 500,
              carbs: 35,
              prots: 18,
              fats: 8,
            },
          }),
        ]),
      })
    );
    expect(next).not.toHaveBeenCalled();
  });
});
