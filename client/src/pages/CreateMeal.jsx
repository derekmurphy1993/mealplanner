import { useState } from "react";

export default function CreateMeal() {
  const [showAddRecipe, setShowAddRecipe] = useState(true);

  const checkHandler = () => {
    setShowAddRecipe(!showAddRecipe);
  };
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create New Meal
      </h1>
      <form className="flex flex-row sm:flex-col">
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Meal Name*"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="120"
            minLength="6"
            required
          />
          <input
            type="number"
            placeholder="Calories p/ serving*"
            className="border p-3 rounded-lg"
            id="calories"
            required
          />
          <input
            type="number"
            placeholder="Carbs p/ serving"
            className="border p-3 rounded-lg"
            id="carbs"
          />
          <input
            type="number"
            placeholder="Fats p/ serving"
            className="border p-3 rounded-lg"
            id="fats"
          />
          <input
            type="number"
            placeholder="Protien p/ serving"
            className="border p-3 rounded-lg"
            id="prots"
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
                placeholder="URL"
                className="border p-3 rounded-lg mb-4"
                id="recipeUrl"
                maxLength="320"
                minLength="6"
              />
            </div>
            <div id="ingredients" className=" mb-4">
              Ingredients:
              <div className="flex-row">
                <input
                  type="text"
                  placeholder="Ingredient"
                  className="border p-3 rounded-lg w-1/2 m-1"
                  id="name"
                  maxLength="120"
                  minLength="6"
                />
                <input
                  type="number"
                  placeholder="amount"
                  className="border p-3 rounded-lg"
                  id="amount"
                />
                <input
                  type="text"
                  placeholder="unit"
                  className="border p-3 rounded-lg"
                  id="unit"
                />
                <div className="font-semibold  text-red-700 hover:text-red-500">
                  Remove
                </div>
              </div>
              <div className="font-semibold text-green-700 hover:text-green-500">
                Add Ingredient
              </div>
            </div>
            Step:
            <div>
              <input
                type="text"
                placeholder="Include the step for the recipe here in order"
                className="border p-3 rounded-lg w-full"
                id="name"
                maxLength="520"
                minLength="6"
                required
              />
              <div className="font-semibold text-red-700 hover:text-red-500">
                Remove Step
              </div>
            </div>
            <div className="font-semibold text-green-700 hover:text-green-500">
              Add Step
            </div>
          </div>
        )}
        <button
          type="submit"
          className="rounded-lg text-slate-100 bg-green-600 hover:bg-green-400 p-3"
        >
          Save Meal
        </button>
      </form>
    </main>
  );
}
