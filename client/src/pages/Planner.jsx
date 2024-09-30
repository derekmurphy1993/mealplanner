import { useState } from "react";
import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";

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
    <div>
      <button onClick={handleGetMeals}> Get Meals </button>
      {error && <p className="text-red-600"> Error fetching data </p>}
      {userMeals &&
        userMeals.length > 0 &&
        userMeals.map((meal) => (
          <div key={meal._id}>
            <p>{meal.name}</p>
          </div>
        ))}
    </div>
  );
}
