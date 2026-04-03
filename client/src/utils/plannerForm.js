const GOAL_LABELS = {
  calories: "Calories",
  carbs: "Carbohydrates",
  prots: "Protein",
  fats: "Fats",
};

export const sanitizePlannerFormPayload = ({
  name,
  plannerLength,
  dayList,
  dailyGoals,
  existingWeek = [],
}) => {
  const parsedGoals = {};

  for (const [key, label] of Object.entries(GOAL_LABELS)) {
    const rawValue = dailyGoals?.[key];
    if (rawValue === "" || rawValue === null || rawValue === undefined) {
      continue;
    }

    const parsed = Number(rawValue);
    if (!Number.isFinite(parsed) || parsed < 0) {
      return { error: `${label} must be a non-negative number.` };
    }

    parsedGoals[key] = parsed;
  }

  const hasAnyGoal = Object.keys(parsedGoals).length > 0;
  const trimmedName = String(name || "").trim();

  if (trimmedName.length > 120) {
    return { error: "Planner name must be 120 characters or fewer." };
  }

  const byDay = new Map((existingWeek || []).map((day) => [day.day, day]));
  const week = dayList.map((day) => {
    const existingDay = byDay.get(day);
    const meals = Array.isArray(existingDay?.meals)
      ? existingDay.meals
          .map((meal) => (typeof meal === "object" ? meal?._id : meal))
          .filter(Boolean)
      : [];

    return {
      day,
      meals,
      ...(hasAnyGoal ? { dailyGoals: parsedGoals } : {}),
    };
  });

  return {
    payload: {
      plannerLength,
      week,
      ...(trimmedName ? { name: trimmedName } : { name: "" }),
    },
  };
};
