const MACRO_FIELDS = ["calories", "carbs", "fats", "prots"];
const MEAL_TAG_OPTIONS = [
  "breakfast",
  "lunch",
  "dinner",
  "snack",
  "vegetarian",
];

export const isValidNumericInput = (value) => /^\d*\.?\d*$/.test(value);

const parseOptionalNonNegativeNumber = (rawValue, fieldLabel) => {
  if (rawValue === "" || rawValue === null || rawValue === undefined) {
    return { value: null };
  }

  const parsed = Number(rawValue);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return { error: `${fieldLabel} must be a non-negative number.` };
  }

  return { value: parsed };
};

const isValidUrl = (value) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

export const sanitizeMealFormPayload = (formData) => {
  const trimmedName = String(formData?.name || "").trim();
  if (trimmedName.length < 5) {
    return { error: "Meal name must be at least 5 characters long." };
  }

  const payload = {
    ...formData,
    name: trimmedName,
    serving: String(formData?.serving || "").trim(),
    mealTags: Array.isArray(formData?.mealTags)
      ? formData.mealTags.filter((tag) => MEAL_TAG_OPTIONS.includes(tag))
      : [],
  };

  for (const field of MACRO_FIELDS) {
    const result = parseOptionalNonNegativeNumber(
      formData?.[field],
      field === "prots" ? "Protein" : field[0].toUpperCase() + field.slice(1),
    );
    if (result.error) return { error: result.error };
    payload[field] = result.value;
  }

  const recipeUrl = String(formData?.recipe?.url || "").trim();
  if (recipeUrl && !isValidUrl(recipeUrl)) {
    return { error: "Recipe URL must be a valid URL." };
  }

  const steps = Array.isArray(formData?.recipe?.steps)
    ? formData.recipe.steps
        .map((step) => String(step || "").trim())
        .filter(Boolean)
    : [];

  const ingredients = Array.isArray(formData?.recipe?.ingredients)
    ? formData.recipe.ingredients
        .map((ingredient) => {
          const itemName = String(ingredient?.itemName || "").trim();
          const itemUnit = String(ingredient?.itemUnit || "").trim();
          const rawAmount = ingredient?.itemAmount;

          if (
            !itemName &&
            !itemUnit &&
            (rawAmount === "" || rawAmount == null)
          ) {
            return null;
          }

          if (!itemName) {
            return { error: "Each ingredient needs a name." };
          }

          const parsedAmount = parseOptionalNonNegativeNumber(
            rawAmount,
            `${itemName} amount`,
          );
          if (parsedAmount.error) return { error: parsedAmount.error };

          return {
            itemName,
            itemAmount: parsedAmount.value,
            itemUnit,
          };
        })
        .filter(Boolean)
    : [];

  const ingredientError = ingredients.find((ingredient) => ingredient?.error);
  if (ingredientError) {
    return { error: ingredientError.error };
  }

  payload.recipe = {
    ...(formData?.recipe || {}),
    url: recipeUrl,
    steps,
    ingredients,
  };

  return { payload };
};
