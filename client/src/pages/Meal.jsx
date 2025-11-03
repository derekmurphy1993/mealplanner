import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { TiDelete } from "react-icons/ti";
import placeholderimg from "../../assets/placeholder.png";

export default function Meal() {
  const [meal, getMeal] = useState(null);
  const params = useParams();

  useEffect(() => {
    const fetchMeal = async () => {
      const mealId = params.mealId;
      const res = await fetch(`/api/meal/get/${mealId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      getMeal(data);
    };

    fetchMeal();
  }, []);

  const handleMealDelete = () => {
    alert("hello!");
  };

  const handleConfirmedMealDelete = async (mealId) => {
    try {
      const res = await fetch(`/api/meal/delete/${mealId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        return;
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="">
      {meal && (
        <div className="flex flex-col min-w-full m-h-full mt-5 justify-items-center items-center">
          <div className="flex flex-row max-h-[275px] overflow-hidden">
            <div className="border w-4/12">
              {meal.image ? (
                <img
                  src={meal.image}
                  alt={"Image of " + meal.name}
                  className=" transition-transform group-hover:scale-110 duration-200 object-cover rounded-lg"
                />
              ) : (
                <img
                  src={placeholderimg}
                  alt={"Placeholder Image"}
                  className=" transition-transform group-hover:scale-110 duration-200 object-cover rounded-lg"
                />
              )}
            </div>
            <div className="flex-1 flex-col w-8/12 ml-5">
              <div className="flex flex-row min-w-screen justify-center items-center mt-2">
                <h1 className="font-bold text-2xl text-azul-600 w-full ml-5">
                  {meal.name || "error finding meal"}
                </h1>
              </div>

              <Link to={`/update-meal/${meal._id}`}>
                <button className="bg-leaf-300 hover:bg-leaf-400 text-azul-600 text-xs rounded-lg	p-2 hover:scale-110 font-semibold uppercase">
                  {" "}
                  Update{" "}
                </button>
              </Link>
              <TiDelete
                className="text-2xl transition-transform ml-2 hover:scale-150 duration-200 text-red-600"
                onClick={handleMealDelete}
              />

              <div className="ml-5">
                <p className=" font-semibold">Calories: {meal.calories}</p>
                <p>Protien: {meal.prots}</p>
                <p>Fats: {meal.fats}</p>
                <p>Carbs: {meal.carbs}</p>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-row">
            <div className="w-4/12 mr-1 pl-3">
              {meal.recipe.url && (
                <Link
                  to={meal.recipe.url}
                  className="text-azul-700 mt-2 hover:underline"
                >
                  {" "}
                  {meal.recipe.url}
                </Link>
              )}
              <p className="font-bold mt-2 "> Ingredients</p>
              {meal.recipe.ingredients.map((ing) => (
                <div
                  key={ing.itemName}
                  className="flex flex-row text-left max-w-md border-b-2 border-y-frenchblue-200 mr-3"
                >
                  <p className="w-4/12">
                    {ing.itemAmount > 0 && ing.itemAmount + " " + ing.itemUnit}
                  </p>
                  <p className="text-wrap ml-1 w-8/12"> {ing.itemName} </p>
                </div>
              ))}
            </div>
            <div className="w-8/12 ml-5 max-w-2xl  border-frenchblue-100 bg-slate-100 border-2 rounded-md p-5 drop-shadow-md text-azul-700">
              <p className="font-bold mt-3"> Directions</p>
              {meal.recipe.steps.map((step, index) => (
                <div key={step} className="relative mr-5 px-5 py-2 ">
                  <div
                    className="flex absolute -left-1
                    items-center justify-center
                    font-bold drop-shadow-lg text-azul-700 rounded-full"
                  >
                    <p className="text-base">{index + 1}</p>
                  </div>
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
