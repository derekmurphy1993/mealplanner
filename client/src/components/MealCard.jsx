/* eslint-disable react/prop-types */
// import { FaHeart, FaRegHeart, FaReceipt } from "react-icons/fa";
import { Link } from "react-router-dom";
import placeholderimg from "../../assets/placeholder.png";

export default function MealCard({ meal }) {
  // prop MODE: simple, normal, display/big pic
  // fa FaLeaf
  // ICON for liking, icon for if it has a link to recipie, icon for if it has recipie built in :)

  return (
    <div className="relative max-w-52 min-w-52 w-full lg:max-w-md xl:max-w-lg h-72 bg-white overflow-hidden rounded-md shadow-xl border-2 border-gray-700 border-opacity-35 group">
      <Link to={`/meal/${meal._id}`}>
        <div className="overflow-hidden items-center h-[40%]  flex justify-center  border-frenchblue-500">
          {meal.image ? (
            <img
              src={meal.image}
              alt={"Image of " + meal.name}
              className=" transition-transform group-hover:scale-110 duration-200 object-cover"
            />
          ) : (
            <img
              src={placeholderimg}
              alt={"Placeholder image, no image found for " + meal.name}
              className="transition-transform group-hover:scale-110 duration-200  border-2"
            />
          )}
        </div>
        <div className="p-2 text-azul-800">
          <p className="font-semibold mx-2 text-lg">{meal.name}</p>
        </div>
        <p className="font-semibold p-1 mx-6">Calories: {meal.calories}</p>
        <div className="flex justify-between mx-8 flex-wrap">
          <div className="mt-0 text-sm flex flex-col justify-center items-center">
            <p className="border-b-2 border-b-slate-300">Protein</p>
            <p className="font-semibold">{meal.prots}g</p>
          </div>
          <div className="mt-0 text-sm flex flex-col justify-center items-center">
            <p className="border-b-2 border-b-slate-300">Fats</p>
            <p className="font-semibold">{meal.fats}g</p>
          </div>
          <div className="mt-0 text-sm flex flex-col justify-center items-center">
            <p className="border-b-2 border-b-slate-300">Carbs</p>
            <p className="font-semibold">{meal.carbs}g</p>
          </div>{" "}
        </div>
        {/* <FaHeart /> <FaRegHeart /> */}
      </Link>
    </div>
  );
}
