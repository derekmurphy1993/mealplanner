import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
  });

  return (
    <div className="flex">
      <div className="flex flex-row">
        <h1 className="font-bold text-xl text-blue-950">{meal.name}</h1>
        <button className="bg-green-400 rounded-lg p-3 font-semibold uppercase text-slate-100">
          {" "}
          Update{" "}
        </button>
      </div>
    </div>
  );
}
