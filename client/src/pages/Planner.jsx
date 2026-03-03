import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import PlannerMealModal from "../components/PlannerMealModal";

export default function Planner() {
  const { currentUser } = useSelector((state) => state.user);
  const [planners, setPlanners] = useState([]);
  const [userMeals, setUserMeals] = useState([]);
  const [selectedPlannerId, setSelectedPlannerId] = useState("");
  const [modalDay, setModalDay] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlanners = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch("/api/planner/");
        const data = await res.json();
        if (!res.ok || data.success === false) {
          setError(data.message || "Problem loading planners.");
          setPlanners([]);
          setSelectedPlannerId("");
          return;
        }

        const list = Array.isArray(data) ? data : [];
        setPlanners(list);
        setSelectedPlannerId((prev) => prev || list[0]?._id || "");
      } catch (err) {
        setError(err.message || "Problem loading planners.");
        setPlanners([]);
        setSelectedPlannerId("");
      } finally {
        setLoading(false);
      }
    };

    fetchPlanners();
  }, []);

  useEffect(() => {
    const fetchUserMeals = async () => {
      if (!currentUser?._id) return;
      try {
        const res = await fetch(`/api/user/meals/${currentUser._id}`);
        const data = await res.json();
        if (!res.ok || data.success === false) {
          setUserMeals([]);
          return;
        }
        setUserMeals(Array.isArray(data) ? data : []);
      } catch {
        setUserMeals([]);
      }
    };

    fetchUserMeals();
  }, [currentUser?._id]);

  const selectedPlanner = useMemo(
    () => planners.find((planner) => planner._id === selectedPlannerId) || null,
    [planners, selectedPlannerId]
  );

  if (loading) {
    return <div className="p-8">Loading planners...</div>;
  }

  if (planners.length === 0) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <p className="text-lg mb-4">No planners found.</p>
        <Link
          to="/create-planner"
          className="inline-block px-4 py-2 bg-azul-600 text-white rounded-lg hover:bg-azul-700"
        >
          Create planner
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gray-50">
      <div className="flex flex-wrap gap-2 items-center mb-6">
        {planners.map((planner) => (
          <button
            key={planner._id}
            type="button"
            onClick={() => setSelectedPlannerId(planner._id)}
            className={`px-4 py-2 rounded-lg border ${
              planner._id === selectedPlannerId
                ? "bg-azul-600 text-white border-azul-700"
                : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {planner.name || "Unnamed planner"}
          </button>
        ))}
        <Link
          to="/create-planner"
          className="px-4 py-2 rounded-lg bg-leaf-400 text-azul-900 hover:bg-leaf-500"
        >
          New Planner
        </Link>
        {selectedPlannerId && (
          <Link
            to={`/update-planner/${selectedPlannerId}`}
            className="px-4 py-2 rounded-lg bg-slate-200 text-slate-800 hover:bg-slate-300"
          >
            Update Planner
          </Link>
        )}
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {selectedPlanner && (
        <>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              {selectedPlanner.name || "Planner"}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {selectedPlanner.plannerLength}-day planner
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {(selectedPlanner.week || []).map((dayObj) => (
              <div key={dayObj.day} className="flex flex-col gap-2">
                <div className="px-1">
                  <h2 className="font-bold text-lg text-gray-800 mb-1">
                    {dayObj.day}
                  </h2>
                  {dayObj.dailyGoals && (
                    <div className="text-sm text-gray-700 mb-2">
                      <p className="font-semibold mb-1">Daily Goals</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-gray-500">
                            Calories
                          </p>
                          <p>{dayObj.dailyGoals.calories ?? "-"}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-gray-500">
                            Protein
                          </p>
                          <p>{dayObj.dailyGoals.prots ?? "-"}g</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-gray-500">
                            Carbs
                          </p>
                          <p>{dayObj.dailyGoals.carbs ?? "-"}g</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-gray-500">
                            Fats
                          </p>
                          <p>{dayObj.dailyGoals.fats ?? "-"}g</p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="text-sm text-gray-700">
                    <p className="font-semibold mb-1">Daily Totals</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">
                          Calories
                        </p>
                        <p>{dayObj.dailyTotals?.calories ?? 0}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">
                          Protein
                        </p>
                        <p>{dayObj.dailyTotals?.prots ?? 0}g</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">
                          Carbs
                        </p>
                        <p>{dayObj.dailyTotals?.carbs ?? 0}g</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">
                          Fats
                        </p>
                        <p>{dayObj.dailyTotals?.fats ?? 0}g</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4 min-h-[180px] flex flex-col">
                  <p className="font-semibold text-sm mb-2">Meals</p>
                  <div className="flex-1">
                    {Array.isArray(dayObj.meals) && dayObj.meals.length > 0 ? (
                      <ul className="text-sm text-gray-700 space-y-1">
                        {dayObj.meals.map((meal, index) => (
                          <li
                            key={`${dayObj.day}-${meal?._id || "missing"}-${index}`}
                            className="border-b border-gray-100 pb-1"
                          >
                            {meal?.name || "Missing meal"}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">No meals assigned.</p>
                    )}
                  </div>
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setModalDay(dayObj.day)}
                      className="h-8 w-8 rounded-full bg-green-600 text-white font-bold text-lg leading-none hover:bg-green-700"
                      aria-label={`Add meal to ${dayObj.day}`}
                      title={`Add meal to ${dayObj.day}`}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <PlannerMealModal
        day={modalDay}
        meals={userMeals}
        onClose={() => setModalDay("")}
      />
    </div>
  );
}
