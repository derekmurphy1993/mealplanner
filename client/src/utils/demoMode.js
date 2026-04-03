import placeholderimg from "../../assets/placeholder.png";

const clone = (value) => JSON.parse(JSON.stringify(value));

const hasCompletedMacros = (meal) =>
  ["calories", "carbs", "fats", "prots"].every(
    (key) => meal?.[key] !== null && meal?.[key] !== undefined && meal?.[key] !== ""
  );

export const DEMO_USER = {
  _id: "demo-user",
  username: "Demo User",
  email: "demo@macroplanner.local",
  avatar: placeholderimg,
  isDemoUser: true,
};

const INITIAL_DEMO_MEALS = [
  {
    _id: "demo-meal-1",
    name: "Chicken Salad and Peach Sandwich",
    serving: "1 sandwich",
    calories: 340,
    carbs: 32,
    fats: 9,
    prots: 28,
    completedMacros: true,
    mealTags: ["lunch"],
    image: "",
    recipe: {
      url: "https://www.nutrition.gov/recipes/chicken-salad-and-peach-sandwich",
      steps: [
        "Mix together the chicken, apples, peaches, celery, onion, walnuts, and mayonnaise in a small bowl.",
        "Spoon mixture onto bread to build the sandwiches.",
      ],
      ingredients: [
        { itemName: "Whole wheat bread", itemAmount: 4, itemUnit: "slices" },
        { itemName: "Cooked chicken", itemAmount: 0.5, itemUnit: "cup" },
        { itemName: "Peach", itemAmount: 0.5, itemUnit: "cup" },
        { itemName: "Celery", itemAmount: 1, itemUnit: "stalk" },
        { itemName: "Apple", itemAmount: 0.5, itemUnit: "cup" },
        { itemName: "Onion", itemAmount: 1, itemUnit: "small" },
        { itemName: "Nonfat mayonnaise", itemAmount: 1.5, itemUnit: "tbsp" },
        { itemName: "Walnuts", itemAmount: 1, itemUnit: "tbsp" },
      ],
    },
  },
  {
    _id: "demo-meal-2",
    name: "Strawberry Mango Feta Toast",
    serving: "1 serving",
    calories: 460,
    carbs: 34,
    fats: 13,
    prots: 42,
    completedMacros: true,
    mealTags: ["breakfast"],
    image: "",
    recipe: {
      url: "https://www.nutrition.gov/recipes/strawberry-mango-feta-toast",
      steps: [
        "Dice most of the mango and strawberries and combine with feta.",
        "Blend the remaining fruit with basil, balsamic vinegar, and olive oil into a vinaigrette.",
        "Toss the fruit-feta mix with vinaigrette, then spoon over toasted bread and top with basil.",
      ],
      ingredients: [
        { itemName: "Mango", itemAmount: 1, itemUnit: "medium" },
        { itemName: "Strawberries", itemAmount: 2, itemUnit: "cups" },
        { itemName: "Fat-free feta cheese", itemAmount: 0.5, itemUnit: "cup" },
        { itemName: "Balsamic vinegar", itemAmount: 2, itemUnit: "tbsp" },
        { itemName: "Basil", itemAmount: 1, itemUnit: "cup" },
        { itemName: "Olive oil", itemAmount: 2, itemUnit: "tbsp" },
        { itemName: "Whole wheat bread", itemAmount: 4, itemUnit: "slices" },
      ],
    },
  },
  {
    _id: "demo-meal-3",
    name: "Turkey Quesadilla",
    serving: "1 quesadilla",
    calories: 520,
    carbs: 48,
    fats: 14,
    prots: 44,
    completedMacros: true,
    mealTags: ["lunch", "dinner"],
    image: "",
    recipe: {
      url: "https://www.nutrition.gov/recipes/turkey-quesadilla",
      steps: [
        "Cook the ground turkey until fully done, then drain.",
        "Add parmesan cheese and chopped vegetables.",
        "Place the turkey mixture on tortillas, fold, and heat until lightly browned.",
      ],
      ingredients: [
        { itemName: "Ground turkey", itemAmount: 1, itemUnit: "pound" },
        { itemName: "Parmesan cheese", itemAmount: 0.25, itemUnit: "cup" },
        { itemName: "Chopped vegetables", itemAmount: 2, itemUnit: "cups" },
        { itemName: "Whole wheat tortillas", itemAmount: 8, itemUnit: "whole" },
      ],
    },
  },
  {
    _id: "demo-meal-4",
    name: "Banana Oatmeal Cookies",
    serving: "2 cookies",
    calories: 310,
    carbs: 26,
    fats: 18,
    prots: 8,
    completedMacros: true,
    mealTags: ["snack", "vegetarian"],
    image: "",
    recipe: {
      url: "https://www.nutrition.gov/recipes/banana-oatmeal-cookies",
      steps: [
        "Mash the bananas until mostly smooth.",
        "Mix in oats, cinnamon, vanilla, and raisins.",
        "Drop spoonfuls onto a baking sheet, flatten, and bake until set.",
      ],
      ingredients: [
        { itemName: "Bananas", itemAmount: 2, itemUnit: "whole" },
        { itemName: "Oats", itemAmount: 1, itemUnit: "cup" },
        { itemName: "Cinnamon", itemAmount: 0.5, itemUnit: "tsp" },
        { itemName: "Vanilla", itemAmount: 0.5, itemUnit: "tsp" },
        { itemName: "Raisins", itemAmount: 0.5, itemUnit: "cup" },
      ],
    },
  },
  {
    _id: "demo-meal-5",
    name: "Homemade Guacamole",
    serving: "1 serving",
    calories: 390,
    carbs: 36,
    fats: 10,
    prots: 29,
    completedMacros: true,
    mealTags: ["snack", "vegetarian"],
    image: "",
    recipe: {
      url: "https://www.nutrition.gov/recipes/homemade-guacamole",
      steps: [
        "Mash the avocado in a bowl.",
        "Mix in the citrus juice, tomatoes, onion, jalapeno, cilantro, salt, and pepper.",
        "Serve with vegetables or tortilla chips.",
      ],
      ingredients: [
        { itemName: "Avocados", itemAmount: 3, itemUnit: "whole" },
        { itemName: "Lemon juice", itemAmount: 1, itemUnit: "tsp" },
        { itemName: "Lime juice", itemAmount: 1, itemUnit: "tbsp" },
        { itemName: "Roma tomatoes", itemAmount: 2, itemUnit: "whole" },
        { itemName: "Red onion", itemAmount: 1.2, itemUnit: "cups" },
        { itemName: "Jalapeno pepper", itemAmount: 0.5, itemUnit: "whole" },
        { itemName: "Cilantro", itemAmount: 0.25, itemUnit: "cup" },
        { itemName: "Salt", itemAmount: 0.5, itemUnit: "tsp" },
        { itemName: "Black pepper", itemAmount: 0.25, itemUnit: "tsp" },
      ],
    },
  },
  {
    _id: "demo-meal-6",
    name: "Sunshine Roll-Ups",
    serving: "1 wrap",
    calories: 430,
    carbs: 29,
    fats: 17,
    prots: 37,
    completedMacros: true,
    mealTags: ["lunch"],
    image: "",
    recipe: {
      url: "https://wikipedia.com/chicken",
      steps: [
        "Mix chicken, celery, oranges, and onion.",
        "Add mayonnaise, soy sauce, garlic, and pepper and stir gently.",
        "Layer the filling on tortilla pieces with lettuce and roll into cones.",
      ],
      ingredients: [
        { itemName: "Cooked chicken", itemAmount: 1, itemUnit: "cup" },
        { itemName: "Celery", itemAmount: 1, itemUnit: "cup" },
        { itemName: "Mandarin oranges", itemAmount: 2, itemUnit: "cups" },
        { itemName: "Onion", itemAmount: 1, itemUnit: "cup" },
        { itemName: "Mayonnaise", itemAmount: 2, itemUnit: "tbsp" },
        { itemName: "Soy sauce", itemAmount: 1, itemUnit: "tsp" },
        { itemName: "Garlic powder", itemAmount: 1, itemUnit: "tsp" },
        { itemName: "Pepper", itemAmount: 1, itemUnit: "tsp" },
        { itemName: "Whole wheat tortilla", itemAmount: 1, itemUnit: "large" },
        { itemName: "Lettuce leaves", itemAmount: 4, itemUnit: "whole" },
      ],
    },
  },
  {
    _id: "demo-meal-7",
    name: "Trail Mix Snack Cup",
    serving: "1 cup",
    calories: 280,
    carbs: 24,
    fats: null,
    prots: 9,
    completedMacros: false,
    mealTags: ["snack", "vegetarian"],
    image: "",
    recipe: {
      url: "https://www.nutrition.gov/recipes",
      steps: ["Portion nuts and dried fruit into a cup."],
      ingredients: [
        { itemName: "Mixed nuts", itemAmount: 0.5, itemUnit: "cup" },
        { itemName: "Dried cranberries", itemAmount: 0.25, itemUnit: "cup" },
      ],
    },
  },
  {
    _id: "demo-meal-8",
    name: "Cafe Tomato Soup",
    serving: "1 bowl",
    calories: null,
    carbs: null,
    fats: null,
    prots: null,
    completedMacros: false,
    mealTags: ["lunch", "vegetarian"],
    image: "",
    recipe: {
      url: "https://www.nutrition.gov/recipes",
      steps: ["Heat and serve."],
      ingredients: [
        { itemName: "Prepared tomato soup", itemAmount: 1, itemUnit: "bowl" },
      ],
    },
  },
  {
    _id: "demo-meal-9",
    name: "Mystery Potluck Plate",
    serving: "",
    calories: null,
    carbs: null,
    fats: null,
    prots: null,
    completedMacros: false,
    mealTags: ["dinner"],
    image: "",
    recipe: {
      url: "",
      steps: [],
      ingredients: [],
    },
  },
];

const INITIAL_DEMO_PLANNERS = [
  {
    _id: "demo-planner-1",
    name: "Demo Week",
    plannerLength: 5,
    week: [
      {
        day: "Monday",
        meals: ["demo-meal-1", "demo-meal-3"],
        dailyGoals: { calories: 2200, carbs: 220, prots: 160, fats: 70 },
      },
      {
        day: "Tuesday",
        meals: ["demo-meal-2"],
        dailyGoals: { calories: 2200, carbs: 220, prots: 160, fats: 70 },
      },
      {
        day: "Wednesday",
        meals: ["demo-meal-3", "demo-meal-7"],
        dailyGoals: { calories: 2200, carbs: 220, prots: 160, fats: 70 },
      },
      {
        day: "Thursday",
        meals: ["demo-meal-1", "demo-meal-2", "demo-meal-8"],
        dailyGoals: { calories: 2200, carbs: 220, prots: 160, fats: 70 },
      },
      {
        day: "Friday",
        meals: ["demo-meal-4", "demo-meal-6", "demo-meal-9"],
        dailyGoals: { calories: 2200, carbs: 220, prots: 160, fats: 70 },
      },
    ],
  },
];

let demoMeals = clone(INITIAL_DEMO_MEALS);
let demoPlanners = clone(INITIAL_DEMO_PLANNERS);

const buildDailyTotals = (meals = []) =>
  meals.reduce(
    (totals, meal) => ({
      calories: totals.calories + Number(meal?.calories || 0),
      carbs: totals.carbs + Number(meal?.carbs || 0),
      prots: totals.prots + Number(meal?.prots || 0),
      fats: totals.fats + Number(meal?.fats || 0),
    }),
    { calories: 0, carbs: 0, prots: 0, fats: 0 }
  );

const resolvePlannerMeals = (planner) => ({
  ...planner,
  week: (planner.week || []).map((day) => {
    const meals = (day.meals || [])
      .map((mealId) => demoMeals.find((meal) => meal._id === mealId))
      .filter(Boolean)
      .map((meal) => clone(meal));

    return {
      ...day,
      meals,
      dailyTotals: buildDailyTotals(meals),
    };
  }),
});

const nextId = (prefix) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const getDemoMeals = () => clone(demoMeals);

export const getDemoMealById = (mealId) =>
  clone(demoMeals.find((meal) => meal._id === mealId) || null);

export const createDemoMeal = (payload) => {
  const meal = {
    ...clone(payload),
    _id: nextId("demo-meal"),
    completedMacros: hasCompletedMacros(payload),
  };
  demoMeals = [...demoMeals, meal];
  return clone(meal);
};

export const updateDemoMeal = (mealId, payload) => {
  let updatedMeal = null;

  demoMeals = demoMeals.map((meal) => {
    if (meal._id !== mealId) return meal;

    updatedMeal = {
      ...clone(meal),
      ...clone(payload),
      _id: mealId,
      completedMacros: hasCompletedMacros(payload),
    };
    return updatedMeal;
  });

  return clone(updatedMeal);
};

export const deleteDemoMeal = (mealId) => {
  demoMeals = demoMeals.filter((meal) => meal._id !== mealId);
  demoPlanners = demoPlanners.map((planner) => ({
    ...planner,
    week: (planner.week || []).map((day) => ({
      ...day,
      meals: (day.meals || []).filter((id) => id !== mealId),
    })),
  }));
};

export const getDemoPlanners = () => demoPlanners.map(resolvePlannerMeals);

export const getDemoPlannerById = (plannerId) => {
  const planner = demoPlanners.find((item) => item._id === plannerId);
  return planner ? resolvePlannerMeals(planner) : null;
};

export const createDemoPlanner = (payload) => {
  const planner = {
    ...clone(payload),
    _id: nextId("demo-planner"),
  };
  demoPlanners = [...demoPlanners, planner];
  return resolvePlannerMeals(planner);
};

export const updateDemoPlanner = (plannerId, payload) => {
  let updatedPlanner = null;

  demoPlanners = demoPlanners.map((planner) => {
    if (planner._id !== plannerId) return planner;
    updatedPlanner = {
      ...clone(planner),
      ...clone(payload),
      _id: plannerId,
    };
    return updatedPlanner;
  });

  return updatedPlanner ? resolvePlannerMeals(updatedPlanner) : null;
};

const DEMO_SUPPORTED_ROUTES = new Set(["/my-planner", "/recipe-book", "/profile"]);

export const getDemoTargetPath = (requestedPath) =>
  DEMO_SUPPORTED_ROUTES.has(requestedPath) ? requestedPath : "/my-planner";
