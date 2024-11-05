/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

export default function MealCard({ meal, index }) {
  return (
    <div>
      <div className="flex flex-row gap-5">
        <Link to={`/meal/${meal._id}`}>
          <p className="text-blue-950 font-semibold">{meal.name}</p>
        </Link>
      </div>
      <p className="text-blue-950 font-semibold">Calories: {meal.calories}</p>

      <div className="flex flex-row">
        <p className="text-blue-950 w-4/12">Protien: {meal.prots}g</p>
        <p className="text-blue-950 w-4/12">Fats: {meal.fats}g</p>
        <p className="text-blue-950 w-4/12">Carbs: {meal.carbs}g</p>
      </div>
    </div>
  );
}
