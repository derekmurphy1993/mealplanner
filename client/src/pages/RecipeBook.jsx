import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import MealCard from "../components/MealCard";

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
        <div className="flex flex-row flex-wrap gap-3 justify-around">
          {userMeals.map((meal, index) => (
            <MealCard key={meal._id} meal={meal} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
