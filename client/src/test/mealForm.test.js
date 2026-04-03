import { sanitizeMealFormPayload } from "../utils/mealForm";

describe("meal form validation", () => {
  it("rejects an invalid recipe URL", () => {
    const result = sanitizeMealFormPayload({
      name: "Turkey Chili",
      serving: "",
      mealTags: [],
      calories: "",
      carbs: "",
      fats: "",
      prots: "",
      recipe: {
        url: "not-a-url",
        steps: [],
        ingredients: [],
      },
    });

    expect(result).toEqual({
      error: "Recipe URL must be a valid URL.",
    });
  });

  it("rejects ingredients without a name", () => {
    const result = sanitizeMealFormPayload({
      name: "Turkey Chili",
      serving: "",
      mealTags: [],
      calories: "",
      carbs: "",
      fats: "",
      prots: "",
      recipe: {
        url: "",
        steps: [],
        ingredients: [{ itemName: "", itemAmount: "2", itemUnit: "cups" }],
      },
    });

    expect(result).toEqual({
      error: "Each ingredient needs a name.",
    });
  });

  it("sanitizes valid meal input", () => {
    const result = sanitizeMealFormPayload({
      name: "  Turkey Chili  ",
      serving: " 1 bowl ",
      mealTags: ["dinner", "invalid"],
      calories: "450",
      carbs: "30",
      fats: "14",
      prots: "35",
      recipe: {
        url: "https://example.com/chili",
        steps: [" Brown meat ", "", " Simmer "],
        ingredients: [
          { itemName: " Ground Turkey ", itemAmount: "16", itemUnit: "oz " },
          { itemName: "", itemAmount: "", itemUnit: "" },
        ],
      },
    });

    expect(result.payload).toEqual({
      name: "Turkey Chili",
      serving: "1 bowl",
      mealTags: ["dinner"],
      calories: 450,
      carbs: 30,
      fats: 14,
      prots: 35,
      recipe: {
        url: "https://example.com/chili",
        steps: ["Brown meat", "Simmer"],
        ingredients: [
          {
            itemName: "Ground Turkey",
            itemAmount: 16,
            itemUnit: "oz",
          },
        ],
      },
    });
  });
});
