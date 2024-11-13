import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { TiDelete } from "react-icons/ti";

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

  // const handleConfirmedMealDelete = async (mealId) => {
  //   try {
  //     const res = await fetch(`/api/meal/delete/${mealId}`, {
  //       method: "DELETE",
  //     });
  //     const data = await res.json();
  //     if (data.success === false) {
  //       return;
  //     }
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  return (
    <div className="">
      {meal && (
        <div className="flex flex-col min-w-full m-h-full mt-5 justify-items-center items-center">
          <div className="flex flex-row max-h-[275px] overflow-hidden  bg-frenchblue-100">
            <div className="border w-4/12">
              {meal.image ? (
                <img
                  src={meal.image}
                  alt={"Image of " + meal.name}
                  className=" transition-transform group-hover:scale-110 duration-200 object-cover rounded-lg"
                />
              ) : (
                "PLACEHOLDER :) "
              )}
            </div>
            <div className="border flex-1 flex-col w-8/12 bg-frenchblue-100">
              <div className="flex flex-row min-w-screen justify-center items-center mt-2">
                <h1 className="font-bold text-xl text-blue-950">
                  {meal.name || "error"}
                </h1>
                <Link to={`/update-meal/${meal._id}`}>
                  <button className="bg-leaf-500 rounded-lg	p-3 font-semibold uppercase text-slate-100">
                    {" "}
                    Update{" "}
                  </button>
                </Link>
                <TiDelete
                  className="text-2xl transition-transform ml-2 hover:scale-150 duration-200 text-red-600"
                  onClick={handleMealDelete}
                />
              </div>
              <div className="ml-5">
                {meal.recipe.url && (
                  <Link to={meal.recipe.url}> URL to Source Recipe</Link>
                )}
                <p className=" font-semibold">Calories: {meal.calories}</p>
                <p>Protien: {meal.prots}</p>
                <p>Fats: {meal.fats}</p>
                <p>Carbs: {meal.carbs}</p>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-row bg-slate-200">
            <div className="w-4/12 border-4 mr-1 pl-3">
              <p className="font-bold border-b-2 mt-2 border-b-frenchblue-200 ">
                {" "}
                Ingredients
              </p>
              {meal.recipe.ingredients.map((ing) => (
                <div
                  key={ing.itemName}
                  className="flex flex-row text-left border-b-2 border-y-frenchblue-100 mr-3"
                >
                  <p className="w-4/12">
                    {ing.itemAmount > 0 && ing.itemAmount + " " + ing.itemUnit}
                  </p>
                  <p className="text-wrap ml-1 w-8/12"> {ing.itemName} </p>
                </div>
              ))}
            </div>
            <div className="w-8/12">
              <p className="font-bold mt-3"> Directions</p>
              {meal.recipe.steps.map((step, index) => (
                <div
                  key={step}
                  className="relative font-semibold bg-frenchblue-100 m-5 p-5 rounded-lg drop-shadow-md text-azul-700"
                >
                  <div
                    className="flex absolute -top-2.5 -left-2.5 w-8 h-8 bg-azul-600 
                    items-center justify-center
                    font-bold drop-shadow-lg text-white rounded-full"
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
