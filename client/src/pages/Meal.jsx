import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { TiDelete, TiWarningOutline } from "react-icons/ti";
import placeholderimg from "../../assets/placeholder.png";
import { apiFetch } from "../utils/api";

export default function Meal() {
  const { currentUser } = useSelector((state) => state.user);
  const [meal, getMeal] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeal = async () => {
      const mealId = params.mealId;
      const endpoint = currentUser
        ? `/api/meal/get/${mealId}?includePublic=true`
        : `/api/meal/public/${mealId}`;
      const res = await apiFetch(endpoint);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      getMeal(data);
    };

    fetchMeal();
  }, [params.mealId, currentUser]);

  const handleConfirmedMealDelete = async () => {
    if (!meal?._id) return;
    try {
      setDeleting(true);
      setDeleteError("");
      const res = await apiFetch(`/api/meal/delete/${meal._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        setDeleteError(data.message || "Problem deleting meal.");
        setDeleting(false);
        return;
      }
      setShowDeleteModal(false);
      navigate("/recipe-book");
    } catch (error) {
      setDeleteError(error.message || "Problem deleting meal.");
      setDeleting(false);
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
              <div className="mt-2 ml-5">
                <div className="inline-flex items-center gap-2">
                  <h1 className="font-bold text-2xl text-azul-600">
                    {meal.name || "error finding meal"}
                  </h1>
                  {meal.completedMacros === false && (
                    <div className="relative group/warn shrink-0">
                      <TiWarningOutline className="text-amber-600 text-2xl" />
                      <span className="pointer-events-none absolute right-0 top-7 z-20 w-56 rounded bg-slate-800 px-2 py-1 text-xs font-normal text-white opacity-0 transition-opacity group-hover/warn:opacity-100">
                        nutritional information needed, please update
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-row">
                <Link to={`/update-meal/${meal._id}`}>
                  <button className="bg-leaf-300 hover:bg-leaf-400 text-azul-600 text-xs rounded-lg	p-2 hover:scale-110 font-semibold uppercase ml-5 mt-2">
                    {" "}
                    Update{" "}
                  </button>
                </Link>
                <TiDelete
                  className="inline-block align-middle text-2xl transition-transform ml-2 hover:scale-150 duration-200 text-red-600"
                  onClick={() => setShowDeleteModal(true)}
                />
              </div>

              <div className="max-w-52 ml-5 mt-4">
                {meal.serving && (
                  <p className="font-semibold mb-2">Servings: {meal.serving}</p>
                )}
                <p className="font-semibold mb-2">Calories: {meal.calories}</p>
                <div className="flex justify-between mx-2 flex-wrap">
                  <div className="mt-0 text-sm flex flex-col justify-center items-center">
                    <p className="border-b-2 border-b-slate-300">Protein</p>
                    <p className="font-semibold">{meal.prots}g</p>
                  </div>
                  <div className="mt-0 text-sm flex flex-col justify-center items-center">
                    <p className="border-b-2 border-b-slate-300">Fats</p>
                    <p className="font-semibold">{meal.fats}g</p>
                  </div>
                  <div className="mt-0 text-sm flex flex-col justify-center items-center">
                    <p className="border-b-2 border-b-slate-300">Carbohydrates</p>
                    <p className="font-semibold">{meal.carbs}g</p>
                  </div>{" "}
                </div>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-row">
            <div className="w-4/12 mr-1 px-3">
              {meal.recipe.url && (
                <a
                  href={meal.recipe.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-azul-700 mt-2 hover:underline"
                >
                  {" "}
                  Link to {meal.name} at Web
                  {/* Create stripped domain from Url */}
                </a>
              )}
              {meal.recipe.ingredients.length > 0 && (
                <div>
                  <p className="font-bold mt-2 "> Ingredients</p>

                  {meal.recipe.ingredients.map((ing) => (
                    <div
                      key={ing.itemName}
                      className="flex flex-row text-left max-w-md border-b-2 border-y-frenchblue-200 mr-3"
                    >
                      <p className="w-4/12">
                        {ing.itemAmount > 0 &&
                          ing.itemAmount + " " + ing.itemUnit}
                      </p>
                      <p className="text-wrap ml-1 w-8/12"> {ing.itemName} </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {meal.recipe.steps.length > 0 && (
              <div className="w-8/12 ml-5 mb-5 max-w-2xl  border-frenchblue-100 bg-slate-100 border-2 rounded-md p-5 drop-shadow-md text-azul-700">
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
            )}
          </div>
        </div>
      )}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Delete this meal?
            </h2>
            <p className="text-sm text-red-600 mb-4">
              This action cannot be undone.
            </p>
            {deleteError && (
              <p className="text-red-600 text-sm mb-3">{deleteError}</p>
            )}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  if (deleting) return;
                  setDeleteError("");
                  setShowDeleteModal(false);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
                onClick={handleConfirmedMealDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
