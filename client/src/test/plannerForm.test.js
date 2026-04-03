import { sanitizePlannerFormPayload } from "../utils/plannerForm";

describe("planner form validation", () => {
  it("rejects negative daily goals", () => {
    const result = sanitizePlannerFormPayload({
      name: "Week 1",
      plannerLength: 5,
      dayList: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      dailyGoals: {
        calories: "-10",
        carbs: "",
        prots: "",
        fats: "",
      },
      existingWeek: [],
    });

    expect(result).toEqual({
      error: "Calories must be a non-negative number.",
    });
  });

  it("preserves existing meals and sanitizes valid planner input", () => {
    const result = sanitizePlannerFormPayload({
      name: "  Week 1  ",
      plannerLength: 5,
      dayList: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      dailyGoals: {
        calories: "2200",
        carbs: "",
        prots: "180",
        fats: "70",
      },
      existingWeek: [
        { day: "Monday", meals: [{ _id: "meal-1" }, { _id: "meal-2" }] },
        { day: "Tuesday", meals: ["meal-3"] },
      ],
    });

    expect(result.payload).toEqual({
      name: "Week 1",
      plannerLength: 5,
      week: [
        {
          day: "Monday",
          meals: ["meal-1", "meal-2"],
          dailyGoals: {
            calories: 2200,
            prots: 180,
            fats: 70,
          },
        },
        {
          day: "Tuesday",
          meals: ["meal-3"],
          dailyGoals: {
            calories: 2200,
            prots: 180,
            fats: 70,
          },
        },
        {
          day: "Wednesday",
          meals: [],
          dailyGoals: {
            calories: 2200,
            prots: 180,
            fats: 70,
          },
        },
        {
          day: "Thursday",
          meals: [],
          dailyGoals: {
            calories: 2200,
            prots: 180,
            fats: 70,
          },
        },
        {
          day: "Friday",
          meals: [],
          dailyGoals: {
            calories: 2200,
            prots: 180,
            fats: 70,
          },
        },
      ],
    });
  });
});
