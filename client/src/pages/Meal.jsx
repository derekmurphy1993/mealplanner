import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

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

  return (
    <div>
      {meal && (
        <div className="flex-col min-w-full m-h-full justify-items-center items-center">
          <div className="flex flex-row min-w-screen justify-center items-center">
            <h1 className="font-bold text-xl text-blue-950 text-center">
              {meal.name || "error"}
            </h1>
            <Link to={`/update-meal/${meal._id}`}>
              <button className="bg-green-400 rounded-lg p-3 font-semibold uppercase text-slate-100">
                {" "}
                Update{" "}
              </button>
            </Link>
          </div>
          <div className="flex-row">
            <div className="border w-4/12">IMAGE</div>
            <div className="border flex-1 flex-col w-8/12">
              <p className="font-semibold">Calories: {meal.calories}</p>
              <p>Protien: {meal.prots}</p>
              <p>Fats: {meal.fats}</p>
              <p>Carbs: {meal.carbs}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
