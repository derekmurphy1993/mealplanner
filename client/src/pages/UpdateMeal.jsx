import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const MACRO_FIELDS = new Set(["calories", "carbs", "fats", "prots"]);
const MEAL_TAG_OPTIONS = [
  "breakfast",
  "lunch",
  "dinner",
  "snack",
  "vegetarian",
];

const isValidNumericInput = (value) => /^-?\d*\.?\d*$/.test(value);

const sanitizeFormPayload = (formData) => {
  const payload = { ...formData };
  payload.serving = (payload.serving || "").trim();
  payload.mealTags = Array.isArray(payload.mealTags)
    ? payload.mealTags.filter((tag) => MEAL_TAG_OPTIONS.includes(tag))
    : [];

  for (const field of MACRO_FIELDS) {
    const raw = payload[field];
    if (raw === "" || raw === null || raw === undefined) {
      payload[field] = null;
      continue;
    }

    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) return null;
    payload[field] = parsed;
  }

  if (Array.isArray(payload?.recipe?.ingredients)) {
    payload.recipe = {
      ...payload.recipe,
      ingredients: payload.recipe.ingredients.map((ingredient) => {
        const rawAmount = ingredient?.itemAmount;
        if (rawAmount === "" || rawAmount === null || rawAmount === undefined) {
          return { ...ingredient, itemAmount: null };
        }

        const parsedAmount = Number(rawAmount);
        if (!Number.isFinite(parsedAmount)) return null;
        return { ...ingredient, itemAmount: parsedAmount };
      }),
    };

    if (payload.recipe.ingredients.some((ingredient) => ingredient === null)) {
      return null;
    }
  }

  return payload;
};

const normalizeMealForForm = (meal) => ({
  ...meal,
  serving: meal?.serving || "",
  mealTags: Array.isArray(meal?.mealTags)
    ? meal.mealTags.filter((tag) => MEAL_TAG_OPTIONS.includes(tag))
    : [],
  calories:
    meal?.calories === null || meal?.calories === undefined
      ? ""
      : String(meal.calories),
  fats:
    meal?.fats === null || meal?.fats === undefined ? "" : String(meal.fats),
  carbs:
    meal?.carbs === null || meal?.carbs === undefined ? "" : String(meal.carbs),
  prots:
    meal?.prots === null || meal?.prots === undefined ? "" : String(meal.prots),
  recipe: {
    ...(meal?.recipe || {}),
    url: meal?.recipe?.url || "",
    steps: Array.isArray(meal?.recipe?.steps) ? meal.recipe.steps : [],
    ingredients: Array.isArray(meal?.recipe?.ingredients)
      ? meal.recipe.ingredients.map((ingredient) => ({
          ...ingredient,
          itemAmount:
            ingredient?.itemAmount === null ||
            ingredient?.itemAmount === undefined
              ? ""
              : String(ingredient.itemAmount),
        }))
      : [],
  },
});

export default function UpdateMeal() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [showAddRecipe, setShowAddRecipe] = useState(true);
  const [showMealTypeOptions, setShowMealTypeOptions] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();

  const [formData, setFormData] = useState({
    name: "",
    serving: "",
    mealTags: [],
    calories: "",
    fats: "",
    carbs: "",
    prots: "",
    image: "",
    recipe: {
      url: "",
      steps: [""],
      ingredients: [{ itemName: "", itemAmount: "", itemUnit: "" }],
    },
  });

  useEffect(() => {
    const fetchMeal = async () => {
      const mealId = params.mealId;
      const res = await fetch(`/api/meal/get/${mealId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(normalizeMealForForm(data));
    };

    fetchMeal();
  }, []);

  console.log(currentUser);

  const checkHandler = () => {
    setShowAddRecipe(!showAddRecipe);
  };

  const handleAddStep = () => {
    setFormData({
      ...formData,
      recipe: {
        ...formData.recipe,
        steps: [...formData.recipe.steps, ""],
      },
    });
  };

  const handleRemoveStep = (index) => {
    const list = [...formData.recipe.steps];
    list.splice(index, 1);
    setFormData({
      ...formData,
      recipe: {
        ...formData.recipe,
        steps: list,
      },
    });
  };

  const handleAddIngredient = () => {
    setFormData({
      ...formData,
      recipe: {
        ...formData.recipe,
        ingredients: [
          ...formData.recipe.ingredients,
          { itemName: "", itemAmount: "", itemUnit: "" },
        ],
      },
    });
  };

  const handleRemoveIngredient = (index) => {
    const list = [...formData.recipe.ingredients];
    list.splice(index, 1);
    setFormData({
      ...formData,
      recipe: {
        ...formData.recipe,
        ingredients: list,
      },
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "recipeUrl") {
      setFormData({
        ...formData,
        recipe: {
          ...formData.recipe,
          url: e.target.value,
        },
      });
      return;
    }

    if (MACRO_FIELDS.has(e.target.id) && !isValidNumericInput(e.target.value)) {
      return;
    }

    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleIngredientChange = (e, index) => {
    if (e.target.id === "itemAmount" && !isValidNumericInput(e.target.value)) {
      return;
    }

    const ingredientList = [...formData.recipe.ingredients];
    ingredientList[index][e.target.id] = e.target.value;

    setFormData({
      ...formData,
      recipe: {
        ...formData.recipe,
        ingredients: ingredientList,
      },
    });
    return;
  };

  const handleStepChange = (e, index) => {
    const stepList = [...formData.recipe.steps];
    stepList[index] = e.target.value;
    setFormData({
      ...formData,
      recipe: {
        ...formData.recipe,
        steps: stepList,
      },
    });
    return;
  };

  const handleMealTagToggle = (tag) => {
    setFormData((prev) => {
      const nextTags = prev.mealTags.includes(tag)
        ? prev.mealTags.filter((item) => item !== tag)
        : [...prev.mealTags, tag];

      return {
        ...prev,
        mealTags: nextTags,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
      const sanitizedFormData = sanitizeFormPayload(formData);
      if (!sanitizedFormData) {
        setError("Macros and ingredient amounts must be valid numbers.");
        setLoading(false);
        return;
      }
      const res = await fetch(`/api/meal/update/${params.mealId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...sanitizedFormData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/meal/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Update Meal</h1>
      <form onSubmit={handleSubmit} className="flex flex-row sm:flex-col">
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Meal Name*"
            className="border font-bold p-3 rounded-lg"
            id="name"
            maxLength="120"
            minLength="5"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <input
            type="text"
            placeholder="Servings (optional)"
            className="border p-3 rounded-lg"
            id="serving"
            maxLength="120"
            onChange={handleChange}
            value={formData.serving}
          />
          <p className="">
            Calories{" "}
            <span className="text-sm font-light text-gray-500 italic">
              per serving
            </span>
          </p>
          <input
            type="number"
            inputMode="decimal"
            placeholder="Calories per serving"
            className="border p-3 rounded-lg"
            id="calories"
            onChange={handleChange}
            value={formData.calories}
          />
          <p className="">
            Carbohydrates{" "}
            <span className="text-sm font-light text-gray-500 italic">
              grams per serving
            </span>
          </p>
          <input
            type="number"
            inputMode="decimal"
            placeholder="Carbohydrates /grams per serving"
            className="border p-3 mt-1 rounded-lg"
            id="carbs"
            onChange={handleChange}
            value={formData.carbs}
          />
          <p className="">
            Fats{" "}
            <span className="text-sm font-light text-gray-500 italic">
              grams per serving
            </span>
          </p>
          <input
            type="number"
            inputMode="decimal"
            placeholder="Fats /grams per serving"
            className="border p-3 rounded-lg"
            id="fats"
            onChange={handleChange}
            value={formData.fats}
          />
          <p className="">
            Protein{" "}
            <span className="text-sm font-light text-gray-500 italic">
              grams per serving
            </span>
          </p>
          <input
            type="number"
            inputMode="decimal"
            placeholder="Protein /grams per serving"
            className="border p-3 rounded-lg"
            id="prots"
            onChange={handleChange}
            value={formData.prots}
          />
          <div>
            <button
              type="button"
              onClick={() => setShowMealTypeOptions((prev) => !prev)}
              className="w-full border rounded-lg p-3 text-left font-semibold hover:bg-gray-50"
            >
              Meal Type (optional) {showMealTypeOptions ? "▴" : "▾"}
            </button>
            {showMealTypeOptions && (
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                {MEAL_TAG_OPTIONS.map((tag) => (
                  <label key={tag} className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.mealTags.includes(tag)}
                      onChange={() => handleMealTagToggle(tag)}
                    />
                    <span className="capitalize">{tag}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
          <div className="flex">
            <p className="mr-3"> Add Recipe Info </p>
            <input
              type="checkbox"
              id="recipeCheckbox"
              checked={showAddRecipe}
              onChange={checkHandler}
            />{" "}
          </div>
        </div>
        {showAddRecipe && (
          <div className="flex flex-col p-4">
            <div>
              Recipe Url:
              <input
                type="text"
                placeholder="URL to recipe"
                className="border p-3 rounded-lg mb-4"
                id="recipeUrl"
                maxLength="320"
                minLength="6"
                value={formData.recipe.url}
                onChange={handleChange}
              />
            </div>
            <div id="ingredients" className=" mb-4">
              Ingredients:
              {formData.recipe.ingredients.length === 0 && (
                <div
                  onClick={handleAddIngredient}
                  className="font-semibold text-green-700 hover:text-green-500"
                >
                  Add Item
                </div>
              )}
              {formData.recipe.ingredients.map((ingredient, index) => (
                <div key={index} className="">
                  <div className="flex-row">
                    <input
                      type="text"
                      placeholder="Ingredient"
                      className="border p-3 rounded-lg w-1/2 m-1"
                      id="itemName"
                      maxLength="120"
                      minLength="3"
                      value={formData.recipe.ingredients[index].itemName}
                      onChange={(e) => handleIngredientChange(e, index)}
                    />
                    <input
                      type="number"
                      inputMode="decimal"
                      placeholder="Amount"
                      className="border p-3 rounded-lg"
                      id="itemAmount"
                      value={formData.recipe.ingredients[index].itemAmount}
                      onChange={(e) => handleIngredientChange(e, index)}
                    />
                    <input
                      type="text"
                      placeholder="unit"
                      className="border p-3 rounded-lg"
                      id="itemUnit"
                      value={formData.recipe.ingredients[index].itemUnit}
                      onChange={(e) => handleIngredientChange(e, index)}
                    />

                    {formData.recipe.ingredients.length > 0 && (
                      <div
                        onClick={() => handleRemoveIngredient(index)}
                        className="font-semibold text-red-700 hover:text-red-500"
                      >
                        Remove
                      </div>
                    )}
                    {formData.recipe.ingredients.length - 1 === index &&
                      formData.recipe.ingredients.length < 30 && (
                        <div
                          onClick={handleAddIngredient}
                          className="font-semibold text-green-700 hover:text-green-500"
                        >
                          Add Item
                        </div>
                      )}
                  </div>
                  {formData.recipe.ingredients.length === 30 &&
                    formData.recipe.ingredients.length - 1 === index &&
                    "Max number of ingredients reached, consider linking to an external page"}
                </div>
              ))}
            </div>
            Instructions:
            {formData.recipe.steps.length === 0 && (
              <div
                onClick={handleAddStep}
                className="font-semibold text-green-700 hover:text-green-500"
              >
                Add Step
              </div>
            )}
            {formData.recipe.steps.map((step, index) => (
              <div key={index} className="">
                <p>Step {index + 1}</p>
                <div className="flex flex-col">
                  <input
                    type="text"
                    placeholder="Include the step for the recipe here in order"
                    className="border p-3 rounded-lg w-10/12"
                    id="stepInput"
                    maxLength="520"
                    minLength="5"
                    value={formData.recipe.steps[index]}
                    onChange={(e) => handleStepChange(e, index)}
                  />
                  {formData.recipe.steps.length > 0 && (
                    <div
                      onClick={() => handleRemoveStep(index)}
                      className="font-semibold text-red-700 hover:text-red-500"
                    >
                      Remove
                    </div>
                  )}
                </div>

                {formData.recipe.steps.length - 1 === index &&
                  formData.recipe.steps.length < 7 && (
                    <div
                      onClick={handleAddStep}
                      className="font-semibold text-green-700 hover:text-green-500"
                    >
                      Add Step
                    </div>
                  )}
                {formData.recipe.steps.length === 7 &&
                  formData.recipe.steps.length - 1 === index &&
                  "Max number of steps reached, consider simplifying or linking to an external page"}
              </div>
            ))}
          </div>
        )}
        <button
          disabled={loading}
          type="submit"
          className="rounded-lg text-slate-100 bg-green-600 hover:bg-green-400 p-3 disabled:opacity-50"
        >
          {loading ? "Updating Meal..." : "Update Meal"}
        </button>
        {error && <p className="text-red-700 text-sm">{error}</p>}
      </form>
    </main>
  );
}
