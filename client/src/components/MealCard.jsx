import { Link } from "react-router-dom";

export default function MealCard({ meal }) {
  return (
    <div className="border border-cyan-800 border-spacing-2 flex flex-col w-4/12 rounded-lg p-3 justify-between gap-3 mt-2">
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
