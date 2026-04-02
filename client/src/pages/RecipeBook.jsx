import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import MealCard from "../components/MealCard";
import { apiFetch } from "../utils/api";

export default function RecipeBook() {
  const { currentUser } = useSelector((state) => state.user);
  const [showMealError, setShowMealError] = useState("");
  const [userMeals, setUserMeals] = useState([]);
  const [loadingMeals, setLoadingMeals] = useState(true);

  useEffect(() => {
    const handleGetMeals = async () => {
      try {
        setLoadingMeals(true);
        setShowMealError("");
        const res = await apiFetch(`/api/user/meals/${currentUser._id}`);
        const data = await res.json();
        if (!res.ok || data.success === false) {
          setUserMeals([]);
          setShowMealError(data.message || "Problem loading meals.");
          return;
        }
        setUserMeals(Array.isArray(data) ? data : []);
      } catch (error) {
        setUserMeals([]);
        setShowMealError(error.message);
      } finally {
        setLoadingMeals(false);
      }
    };

    handleGetMeals();
  }, [currentUser._id]);

  return (
    <div className="flex flex-col">
      <h1 className="text-center mt-7 text-2xl">Your Meals</h1>
      <Link to={`/create-meal`}>
        <p className="text-center text-blue-600 hover:underline">
          Create New Meal
        </p>
      </Link>

      {loadingMeals && (
        <p className="mt-4 text-center text-slate-600">Loading meals...</p>
      )}
      {!loadingMeals && !showMealError && userMeals.length < 1 && (
        <p className="text-red-600 mt-4 text-center font-semibold">
          No meals found, add some in your recipe book
        </p>
      )}
      {showMealError && (
        <p className="text-red-600 mt-4 text-center">{showMealError}</p>
      )}

      {!loadingMeals && userMeals.length > 0 && (
        <div className="flex flex-row flex-wrap gap-3 justify-around">
          {userMeals.map((meal, index) => (
            <MealCard key={meal._id} meal={meal} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
