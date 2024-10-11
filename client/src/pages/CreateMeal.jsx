import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CreateMeal() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [showAddRecipe, setShowAddRecipe] = useState(true);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    calories: 0,
    fats: 0,
    carbs: 0,
    prots: 0,
    image: "",
    recipe: {
      url: "",
      steps: [""],
      ingredients: [{ itemName: "", itemAmount: 0, itemUnit: "" }],
    },
  });

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
          { itemName: "", itemAmount: 0, itemUnit: "" },
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
    } else {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleIngredientChange = (e, index) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
      const res = await fetch("api/meal/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
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
      <h1 className="text-3xl font-semibold text-center my-7">
        Create New Meal
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-row sm:flex-col">
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Meal Name*"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="120"
            minLength="5"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <input
            type="number"
            placeholder="Calories p/ serving*"
            className="border p-3 rounded-lg"
            id="calories"
            required
            onChange={handleChange}
            value={formData.calories}
          />
          <input
            type="number"
            placeholder="Carbs p/ serving"
            className="border p-3 rounded-lg"
            id="carbs"
            onChange={handleChange}
            value={formData.carbs}
          />
          <input
            type="number"
            placeholder="Fats p/ serving"
            className="border p-3 rounded-lg"
            id="fats"
            onChange={handleChange}
            value={formData.fats}
          />
          <input
            type="number"
            placeholder="Protien p/ serving"
            className="border p-3 rounded-lg"
            id="prots"
            onChange={handleChange}
            value={formData.prots}
          />
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
                    {formData.recipe.ingredients.length > 1 && (
                      <div
                        onClick={() => handleRemoveIngredient(index)}
                        className="font-semibold text-red-700 w-2/12 hover:text-red-500 text-center"
                      >
                        Remove
                      </div>
                    )}
                  </div>

                  {formData.recipe.ingredients.length - 1 === index &&
                    formData.recipe.ingredients.length < 30 && (
                      <div
                        onClick={handleAddIngredient}
                        className="font-semibold text-green-700 hover:text-green-500"
                      >
                        Add Item
                      </div>
                    )}
                  {formData.recipe.ingredients.length === 30 &&
                    formData.recipe.ingredients.length - 1 === index &&
                    "Max number of ingredients reached, consider linking to an external page"}
                </div>
              ))}
            </div>
            Instructions:
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
                    value={formData.recipe.steps[index].step}
                    onChange={(e) => handleStepChange(e, index)}
                  />
                  {formData.recipe.steps.length > 1 && (
                    <div
                      onClick={() => handleRemoveStep(index)}
                      className="font-semibold text-red-700 w-2/12 hover:text-red-500 text-center"
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
          {loading ? "Saving Meal..." : "Save Meal"}
        </button>
        {error && <p className="text-red-700 text-sm">{error}</p>}
      </form>
    </main>
  );
}
