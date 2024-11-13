/* eslint-disable react/prop-types */
// import { FaHeart, FaRegHeart, FaReceipt } from "react-icons/fa";
import { Link } from "react-router-dom";
import placeholderimg from "../../assets/placeholder.png";

export default function MealCard({ meal }) {
  // prop MODE: simple, normal, display/big pic
  // fa FaLeaf
  // ICON for liking, icon for if it has a link to recipie, icon for if it has recipie built in :)

  return (
    <div className="relative w-2/12 bg-frenchblue-100 overflow-hidden rounded-lg shadow-md border-2 border-frenchblue-500 group">
      <div className="overflow-hidden items-center max-h-[40%] min-h-[40%]  flex justify-center">
        {meal.image ? (
          <img
            src={meal.image}
            alt={"Image of " + meal.name}
            className=" transition-transform group-hover:scale-110 duration-200 object-cover"
          />
        ) : (
          <img
            src={placeholderimg}
            alt={"No image found for " + meal.name}
            className="transition-transform group-hover:scale-110 duration-200"
          />
        )}
      </div>
      <div className="p-2 text-azul-800">
        <Link to={`/meal/${meal._id}`}>
          <p className="font-semibold text-lg">{meal.name}</p>
        </Link>
      </div>
      <p className="font-semibold p-1">Calories: {meal.calories}</p>
      <div className="flex flex-col justify-between flex-wrap">
        <p className="m-1">Protien: {meal.prots}g</p>
        <p className="m-1">Fats: {meal.fats}g</p>
        <p className="m-1">Carbs: {meal.carbs}g</p>
      </div>
      {/* <FaHeart /> <FaRegHeart /> */}
    </div>
  );
}
