import { useState } from "react";

export default function CreateMeal() {
  const [showAddRecipe, setShowAddRecipe] = useState(true);
  const [stepItems, setStepItems] = useState([{ step: "" }]);
  const [ingredients, setIngredients] = useState([{ step: "" }]);

  const checkHandler = () => {
    setShowAddRecipe(!showAddRecipe);
  };

  const handleAddStep = () => {
    setStepItems([...stepItems, { step: "" }]);
  };

  const handleRemoveStep = (index) => {
    const list = [...stepItems];
    list.splice(index, 1);
    setStepItems(list);
  };

  const handleAddItem = () => {
    setIngredients([...ingredients, { ingredient: "" }]);
  };

  const handleRemoveItem = (index) => {
    const list = [...ingredients];
    list.splice(index, 1);
    setIngredients(list);
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
              {ingredients.map((step, index) => (
                <div key={index} className="">
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
                    {ingredients.length > 1 && (
                      <div
                        onClick={() => handleRemoveItem(index)}
                        className="font-semibold text-red-700 w-2/12 hover:text-red-500 text-center"
                      >
                        Remove
                      </div>
                    )}
                  </div>

                  {ingredients.length - 1 === index &&
                    ingredients.length < 7 && (
                      <div
                        onClick={handleAddItem}
                        className="font-semibold text-green-700 hover:text-green-500"
                      >
                        Add Item
                      </div>
                    )}
                  {ingredients.length === 7 &&
                    ingredients.length - 1 === index &&
                    "Max number of steps reached, consider simplifying or linking to an external page"}
                </div>
              ))}
            </div>
            Instructions:
            {stepItems.map((step, index) => (
              <div key={index} className="">
                <p>Step {index + 1}</p>
                <div className="flex flex-col">
                  <input
                    type="text"
                    placeholder="Include the step for the recipe here in order"
                    className="border p-3 rounded-lg w-10/12"
                    id="name"
                    maxLength="520"
                    minLength="6"
                    required
                  />
                  {stepItems.length > 1 && (
                    <div
                      onClick={() => handleRemoveItem(index)}
                      className="font-semibold text-red-700 w-2/12 hover:text-red-500 text-center"
                    >
                      Remove
                    </div>
                  )}
                </div>

                {stepItems.length - 1 === index && stepItems.length < 7 && (
                  <div
                    onClick={handleAddStep}
                    className="font-semibold text-green-700 hover:text-green-500"
                  >
                    Add Step
                  </div>
                )}
                {stepItems.length === 7 &&
                  stepItems.length - 1 === index &&
                  "Max number of steps reached, consider simplifying or linking to an external page"}
              </div>
            ))}
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
