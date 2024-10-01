import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Planner() {
  const [error, setError] = useState(false);
  const [userMeals, setUserMeals] = useState([]);

  const { currentUser } = useSelector((state) => state.user);

  const handleGetMeals = async () => {
    try {
      setError(false);
      const res = await fetch(`/api/user/meals/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setError(true);
        return;
      }
      setUserMeals(data);
    } catch (error) {
      setError(true);
    }
  };
  return (
    <div className="flex flex-row">
      <div className="w-4/12">
        <button onClick={handleGetMeals}> Get Meals </button>
        {error && <p className="text-red-600"> Error fetching data </p>}
        {userMeals &&
          userMeals.length > 0 &&
          userMeals.map((meal) => (
            <div
              key={meal._id}
              className="border border-cyan-800 border-spacing-2 flex flex-col rounded-lg p-3 justify-between gap-3 mt-2"
            >
              {console.log(meal)}
              <Link to={`/meal/${meal._id}`}>
                <p className="text-blue-950 font-semibold">{meal.name}</p>
              </Link>
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
      <div className="w-8/12">planner</div>
    </div>
  );
}
