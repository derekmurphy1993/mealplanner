/* eslint-disable react/prop-types */
// import { FaHeart, FaRegHeart, FaReceipt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { TiWarningOutline } from "react-icons/ti";
import placeholderimg from "../../assets/placeholder.png";

export default function MealCard({ meal }) {
  // prop MODE: simple, normal, display/big pic
  // fa FaLeaf
  // ICON for liking, icon for if it has a link to recipie, icon for if it has recipie built in :)

  return (
    <div className="relative max-w-52 min-w-52 w-full lg:max-w-56 xl:max-w-lg xl:gap-14 h-72 bg-white overflow-hidden rounded-md shadow-xl border-2 border-gray-700 border-opacity-35 group hover:scale-105 hover:drop-shadow-2xl hover:z-30">
      <Link to={`/meal/${meal._id}`}>
        <div className="overflow-hidden items-center h-[40%]  flex justify-center ">
          {meal.image ? (
            <img
              src={meal.image}
              alt={"Image of " + meal.name}
              className=" transition-transform duration-200 object-cover"
            />
          ) : (
            <img
              src={placeholderimg}
              alt={"Placeholder image, no image found for " + meal.name}
              className="transition-transform duration-200  border-2"
            />
          )}
        </div>
        <div className="p-2 text-azul-800">
          <div className="font-semibold mx-2 text-lg xl:text-2xl xl:ml-10 border-t-2 border-frenchblue-200 border-opacity-45 flex items-start justify-between gap-2">
            <p className="pr-1">{meal.name}</p>
            {meal.completedMacros === false && (
              <div className="relative group/warn shrink-0 mt-0.5">
                <TiWarningOutline className="text-amber-600 text-xl" />
                <span className="pointer-events-none absolute right-0 top-6 z-20 w-44 rounded bg-slate-800 px-2 py-1 text-xs font-normal text-white opacity-0 transition-opacity group-hover/warn:opacity-100">
                  nutritional information needed, please update
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="max-w-96 mx-auto ">
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
        </div>
      </Link>
    </div>
  );
}
