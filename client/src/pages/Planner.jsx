import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import DroppableDayColumn from "../components/DroppableDayColumn";

const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const COLUMN_IDS = ["pool", ...DAY_ORDER];

function buildInitialItems(userMeals = [], week = []) {
  const pool = (userMeals || []).map((m) => m._id);
  const items = {
    pool,
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
  };
  (week || []).forEach((dayObj) => {
    const day = dayObj.day;
    if (items[day] && Array.isArray(dayObj.meals)) {
      items[day] = dayObj.meals.map((m) => (typeof m === "object" && m._id ? m._id : m));
    }
  });
  return items;
}

function buildMealsById(userMeals = [], week = []) {
  const byId = {};
  (userMeals || []).forEach((m) => {
    if (m && m._id) byId[m._id] = m;
  });
  (week || []).forEach((dayObj) => {
    (dayObj.meals || []).forEach((m) => {
      if (m && m._id) byId[m._id] = m;
    });
  });
  return byId;
}

function weekFromItems(items, mealsById) {
  return DAY_ORDER.map((day) => ({
    day,
    meals: (items[day] || [])
      .map((id) => mealsById[id])
      .filter(Boolean),
  }));
}

export default function Planner() {
  const [error, setError] = useState(false);
  const [userPlanners, setUserPlanners] = useState([]);
  const [currentPlanner, setCurrentPlanner] = useState(null);
  const [userMeals, setUserMeals] = useState([]);
  const [inDev] = useState(false);
  const [items, setItems] = useState(() => buildInitialItems([], []));
  const [mealsById, setMealsById] = useState(() => buildMealsById([], []));
  const previousItemsRef = useRef(items);
  const lastItemsRef = useRef(items);

  const { currentUser } = useSelector((state) => state.user);

  const handleGetPlanner = useCallback(async () => {
    if (!currentUser?._id) return;
    try {
      setError(false);
      const res = await fetch(`/api/user/planners/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setError(true);
        return;
      }
      setUserPlanners(Array.isArray(data) ? data : []);
    } catch {
      setError(true);
    }
  }, [currentUser?._id]);

  const fetchUserMeals = useCallback(async () => {
    if (!currentUser?._id) return;
    try {
      const res = await fetch(`/api/user/meals/${currentUser._id}`);
      const data = await res.json();
      if (!data.success && Array.isArray(data) === false) return;
      const list = Array.isArray(data) ? data : [];
      setUserMeals(list);
      setMealsById((prev) => {
        const next = { ...prev };
        list.forEach((m) => {
          if (m && m._id) next[m._id] = m;
        });
        return next;
      });
    } catch {
      // ignore
    }
  }, [currentUser?._id]);

  useEffect(() => {
    handleGetPlanner();
    fetchUserMeals();
  }, [handleGetPlanner, fetchUserMeals]);

  // Sync items + mealsById when currentPlanner or userMeals change
  useEffect(() => {
    if (!currentPlanner?.week) return;
    const week = currentPlanner.week;
    const nextItems = buildInitialItems(userMeals, week);
    const nextMealsById = buildMealsById(userMeals, week);
    setItems(nextItems);
    setMealsById(nextMealsById);
    previousItemsRef.current = nextItems;
    // Intentionally stable deps to avoid overwriting local drag state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPlanner?._id, currentPlanner?.week?.length, userMeals.length]);

  const handleCreatePlanner = async () => {
    try {
      setError(false);
      const res = await fetch(`/api/planner/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          week: DAY_ORDER.map((day) => ({ day, meals: [] })),
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(true);
        return;
      }
      setCurrentPlanner(data);
      setItems(buildInitialItems(userMeals, data.week));
      setMealsById(buildMealsById(userMeals, data.week));
    } catch {
      setError(true);
    }
  };

  const selectWeek = (index) => {
    setCurrentPlanner(userPlanners[index]);
  };

  const persistWeek = useCallback(
    async (nextItems) => {
      if (!currentPlanner?._id) return;
      const week = weekFromItems(nextItems, mealsById);
      try {
        const res = await fetch(`/api/planner/update/${currentPlanner._id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ week }),
        });
        if (!res.ok) setError(true);
      } catch {
        setError(true);
      }
    },
    [currentPlanner?._id, mealsById]
  );

  const handleDragStart = () => {
    previousItemsRef.current = items;
  };

  const handleDragOver = (event) => {
    if (event.canceled) return;
    const { source } = event.operation || {};
    if (!source?.id) return;
    setItems((current) => {
      const next = move(current, event);
      lastItemsRef.current = next;
      return next;
    });
  };

  const handleDragEnd = (event) => {
    if (event.canceled) {
      setItems(previousItemsRef.current);
      return;
    }
    previousItemsRef.current = lastItemsRef.current;
    if (currentPlanner?._id) persistWeek(lastItemsRef.current);
  };

  if (inDev) {
    return <div className="p-8">Coming Soon!</div>;
  }

  const hasPlanners = Array.isArray(userPlanners) && userPlanners.length > 0;

  if (!hasPlanners) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Meal planner</h1>
        {error && <p className="text-red-600 mb-4">Error fetching data</p>}
        <button
          type="button"
          onClick={handleCreatePlanner}
          className="px-4 py-2 bg-azul-600 text-white rounded-lg hover:bg-azul-700"
        >
          Create 5-day planner
        </button>
      </div>
    );
  }

  if (!currentPlanner) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Select a week</h1>
        {error && <p className="text-red-600 mb-4">Error fetching data</p>}
        <div className="flex flex-wrap gap-2">
          {userPlanners.map((planner, index) => (
            <button
              key={planner._id || index}
              type="button"
              onClick={() => selectWeek(index)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100"
            >
              Week {index + 1}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gray-50">
      <div className="flex flex-col gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Weekly planner</h1>
        {error && (
          <p className="text-red-600">Error saving. Check your connection.</p>
        )}
      </div>

      <DragDropProvider
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-row gap-4 overflow-x-auto pb-4">
          {COLUMN_IDS.map((columnId) => (
            <DroppableDayColumn
              key={columnId}
              columnId={columnId}
              mealIds={items[columnId] || []}
              mealsById={mealsById}
              isPool={columnId === "pool"}
            />
          ))}
        </div>
      </DragDropProvider>
    </div>
  );
}
