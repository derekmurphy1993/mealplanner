import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Search from "../components/Search";

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
      <div className="w-4/12 overflow-clip">
        <Search />
        {error && <p className="text-red-600"> Error fetching data </p>}
      </div>
      <div className="w-8/12">planner</div>
    </div>
  );
}
