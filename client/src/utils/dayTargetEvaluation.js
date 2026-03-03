const toFiniteNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const getTargetStatus = (goal, actual, lowerPct, upperPct, label) => {
  if (goal === null || goal <= 0) {
    return { ok: false, message: `Set ${label} goal` };
  }

  const min = goal * (1 - lowerPct);
  const max = goal * (1 + upperPct);

  if (actual < min) return { ok: false, message: `Need more ${label}` };
  if (actual > max) return { ok: false, message: `Need less ${label}` };
  return { ok: true, message: "" };
};

export const getDayGoalFeedback = (dayObj) => {
  const goals = dayObj?.dailyGoals || {};
  const totals = dayObj?.dailyTotals || {};

  const checks = [
    getTargetStatus(
      toFiniteNumber(goals.calories),
      toFiniteNumber(totals.calories) ?? 0,
      0.05,
      0.05,
      "calories"
    ),
    getTargetStatus(
      toFiniteNumber(goals.prots),
      toFiniteNumber(totals.prots) ?? 0,
      0.1,
      0.1,
      "protein"
    ),
    getTargetStatus(
      toFiniteNumber(goals.carbs),
      toFiniteNumber(totals.carbs) ?? 0,
      0.1,
      0.06,
      "carbs"
    ),
    getTargetStatus(
      toFiniteNumber(goals.fats),
      toFiniteNumber(totals.fats) ?? 0,
      0.08,
      0.03,
      "fats"
    ),
  ];

  const messages = checks.filter((check) => !check.ok).map((check) => check.message);
  return { allInRange: messages.length === 0, messages };
};
