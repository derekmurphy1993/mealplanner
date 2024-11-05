import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Search from "../components/Search";
import DayColumn from "../components/DayColumn";

export default function Planner() {
  const [error, setError] = useState(false);
  const [userPlanners, setUserPlanners] = useState([]);
  const [currentPlanner, setCurrentPlanner] = useState(null);
  const [userMeals, setUserMeals] = useState([]);

  const { currentUser } = useSelector((state) => state.user);

  const handleGetPlanner = async () => {
    try {
      setError(false);
      const res = await fetch(`/api/user/planners/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setError(true);
        return;
      }
      setUserPlanners(data);
    } catch (error) {
      setError(true);
    }
  };

  useEffect(() => {
    handleGetPlanner();
  }, []);

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

  console.log("current planner, ", currentPlanner);

  const handleCreatePlanner = async () => {
    try {
      setError(false);
      const res = await fetch(`/api/planner/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          week: [
            { day: "Monday", meals: [] },
            { day: "Tuesday", meals: [] },
            { day: "Wednesday", meals: [] },
            { day: "Thursday", meals: [] },
            { day: "Friday", meals: [] },
          ],
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(true);
        return;
      }
      setCurrentPlanner(data);
    } catch (error) {
      setError(true);
    }
  };

  const selectWeek = (index) => {
    setCurrentPlanner(userPlanners[index]);
  };

  return (
    <div>
      {!userPlanners ? (
        <p onClick={handleCreatePlanner}>Create 5 Day Planner</p>
      ) : (
        <div className="flex flex-row">
          <div className="w-4/12 overflow-clip">
            <p> PLANNER </p>
            {/* <Search /> */}
            {error && <p className="text-red-600"> Error fetching data </p>}
          </div>
          <div className="w-8/12 flex flex-row justify-between">
            {userPlanners &&
              !currentPlanner &&
              userPlanners.map((week, index) => (
                <p key={index} onClick={() => selectWeek(index)}>
                  Week + {index}
                </p>
              ))}
            {currentPlanner &&
              currentPlanner.week.map((day) => (
                <DayColumn key={day._id} day={day} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
