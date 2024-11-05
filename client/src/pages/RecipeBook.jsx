import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function RecipeBook() {
  const { currentUser } = useSelector((state) => state.user);
  const [showMealError, setShowMealError] = useState(false);
  const [userMeals, setUserMeals] = useState([]);

  const handleGetMeals = async () => {
    try {
      setShowMealError(false);
      const res = await fetch(`/api/user/meals/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowMealError(true);
        return;
      }
      setUserMeals(data);
    } catch (error) {
      setShowMealError(true);
    }
  };

  useEffect(() => {
    handleGetMeals();
  }, []);

  const handleMealDelete = async (mealId) => {
    try {
      const res = await fetch(`/api/meal/delete/${mealId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        return;
      }
      setUserMeals((prev) => prev.filter((listing) => listing._id !== mealId));
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-center mt-7 text-2xl">Your Meals</h1>
      <Link to={`/create-meal`}>
        <p className="text-center text-blue-600 hover:underline">
          Create New Meal
        </p>
      </Link>
      {userMeals.length < 1 && (
        <p className="text-red-600">
          {" "}
          No meals found, add some in your recipe book
        </p>
      )}
      {showMealError && <p className="text-red-600"> Error fetching data </p>}

      {userMeals && userMeals.length > 0 && (
        <div className="flex flex-row flex-wrap gap-4">
          {userMeals.map((meal) => (
            <div
              key={meal._id}
              className="border border-cyan-800 border-spacing-2 flex flex-col w-4/12 rounded-lg p-3 justify-between gap-3 mt-2"
            >
              <div className="flex flex-row gap-5">
                <Link to={`/meal/${meal._id}`}>
                  <p className="text-blue-950 font-semibold">{meal.name}</p>
                </Link>
                <button
                  onClick={() => handleMealDelete(meal._id)}
                  className="text-red-700 text-right uppercase font-semibold"
                >
                  Dlt
                </button>
              </div>
              <p className="text-blue-950 font-semibold">
                Calories: {meal.calories}
              </p>

              <div className="flex flex-row">
                <p className="text-blue-950 w-4/12">Protien: {meal.prots}g</p>
                <p className="text-blue-950 w-4/12">Fats: {meal.fats}g</p>
                <p className="text-blue-950 w-4/12">Carbs: {meal.carbs}g</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
