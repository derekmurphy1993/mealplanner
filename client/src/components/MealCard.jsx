/* eslint-disable react/prop-types */
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import { Link } from "react-router-dom";

export default function MealCard({ meal, index, del }) {
  // prop MODE: simple, normal, display/big pic

  // ICON for liking, icon for if it has a link to recipie, icon for if it has recipie built in :)

  return (
    <div className="relative w-2/12 overflow-hidden rounded-lg shadow-md border-2 border-blue-900 group">
      {meal.image && (
        <img
          src={meal.image}
          alt={"Image of " + meal.name}
          className="transition-transform group-hover:scale-110 duration-200"
        />
      )}
      <div className="">
        <Link to={`/meal/${meal._id}`}>
          <p className="font-semibold">{meal.name}</p>
        </Link>
      </div>
      <p className="font-semibold">Calories: {meal.calories}</p>
      <div className="flex flex-row justify-between m-5">
        <p className="">Protien: {meal.prots}g</p>
        <p className="">Fats: {meal.fats}g</p>
        <p className="">Carbs: {meal.carbs}g</p>
      </div>
      {/* <FaHeart /> <FaRegHeart /> */}
      <TiDelete
        className="transition-transform hover:scale-150 duration-200 text-red-600 absolute bottom-1 right-1"
        onClick={() => del(meal._id)}
      />
    </div>
  );
}
