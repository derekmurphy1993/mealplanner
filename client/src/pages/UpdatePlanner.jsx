import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const DAY_5 = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const DAY_7 = [...DAY_5, "Saturday", "Sunday"];

export default function UpdatePlanner() {
  const navigate = useNavigate();
  const { plannerId } = useParams();

  const [name, setName] = useState("");
  const [plannerLength, setPlannerLength] = useState(5);
  const [dailyGoals, setDailyGoals] = useState({
    calories: "",
    carbs: "",
    prots: "",
    fats: "",
  });
  const [existingWeek, setExistingWeek] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const dayList = useMemo(
    () => (plannerLength === 7 ? DAY_7 : DAY_5),
    [plannerLength]
  );

  const numericGoals = useMemo(() => {
    const parsed = {
      calories:
        dailyGoals.calories === "" ? undefined : Number(dailyGoals.calories),
      carbs: dailyGoals.carbs === "" ? undefined : Number(dailyGoals.carbs),
      prots: dailyGoals.prots === "" ? undefined : Number(dailyGoals.prots),
      fats: dailyGoals.fats === "" ? undefined : Number(dailyGoals.fats),
    };
    const hasAnyGoal = Object.values(parsed).some((v) => v !== undefined);
    return { parsed, hasAnyGoal };
  }, [dailyGoals]);

  useEffect(() => {
    const fetchPlanner = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`/api/planner/${plannerId}`);
        const data = await res.json();
        if (!res.ok || data.success === false) {
          setError(data.message || "Problem loading planner.");
          return;
        }

        setName(data.name || "");
        setPlannerLength(data.plannerLength === 7 ? 7 : 5);
        setExistingWeek(Array.isArray(data.week) ? data.week : []);

        const firstGoals = Array.isArray(data.week)
          ? data.week.find((d) => d?.dailyGoals)?.dailyGoals
          : null;
        setDailyGoals({
          calories:
            firstGoals?.calories === undefined ? "" : String(firstGoals.calories),
          carbs: firstGoals?.carbs === undefined ? "" : String(firstGoals.carbs),
          prots: firstGoals?.prots === undefined ? "" : String(firstGoals.prots),
          fats: firstGoals?.fats === undefined ? "" : String(firstGoals.fats),
        });
      } catch (err) {
        setError(err.message || "Problem loading planner.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlanner();
  }, [plannerId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const byDay = new Map((existingWeek || []).map((day) => [day.day, day]));
      const week = dayList.map((day) => {
        const existingDay = byDay.get(day);
        const meals = Array.isArray(existingDay?.meals)
          ? existingDay.meals
              .map((meal) => (typeof meal === "object" ? meal?._id : meal))
              .filter(Boolean)
          : [];
        return {
          day,
          meals,
          ...(numericGoals.hasAnyGoal ? { dailyGoals: numericGoals.parsed } : {}),
        };
      });

      const payload = {
        plannerLength,
        week,
      };

      if (name.trim()) {
        payload.name = name.trim();
      } else {
        payload.name = "";
      }

      const res = await fetch(`/api/planner/${plannerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || data.success === false) {
        setError(data.message || "Problem updating planner.");
        setSaving(false);
        return;
      }

      navigate("/my-planner");
    } catch (err) {
      setError(err.message || "Problem updating planner.");
      setSaving(false);
      return;
    }

    setSaving(false);
  };

  if (loading) {
    return <div className="p-8">Loading planner...</div>;
  }

  return (
    <main className="p-4 md:p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Update Planner</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="plannerName" className="block font-semibold mb-2">
            Name (optional)
          </label>
          <input
            id="plannerName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Week 1"
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <p className="font-semibold mb-2">Planner length</p>
          <div className="flex gap-4">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="plannerLength"
                checked={plannerLength === 5}
                onChange={() => setPlannerLength(5)}
              />
              5 Day (Mon-Fri)
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="plannerLength"
                checked={plannerLength === 7}
                onChange={() => setPlannerLength(7)}
              />
              7 Day (Mon-Sun)
            </label>
          </div>
        </div>

        <div>
          <p className="font-semibold mb-2">Daily macro goals (optional)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="number"
              inputMode="numeric"
              placeholder="Calories"
              className="border rounded-lg p-3"
              value={dailyGoals.calories}
              onChange={(e) =>
                setDailyGoals((prev) => ({ ...prev, calories: e.target.value }))
              }
            />
            <input
              type="number"
              inputMode="numeric"
              placeholder="Carbohydrates (g)"
              className="border rounded-lg p-3"
              value={dailyGoals.carbs}
              onChange={(e) =>
                setDailyGoals((prev) => ({ ...prev, carbs: e.target.value }))
              }
            />
            <input
              type="number"
              inputMode="numeric"
              placeholder="Protein (g)"
              className="border rounded-lg p-3"
              value={dailyGoals.prots}
              onChange={(e) =>
                setDailyGoals((prev) => ({ ...prev, prots: e.target.value }))
              }
            />
            <input
              type="number"
              inputMode="numeric"
              placeholder="Fats (g)"
              className="border rounded-lg p-3"
              value={dailyGoals.fats}
              onChange={(e) =>
                setDailyGoals((prev) => ({ ...prev, fats: e.target.value }))
              }
            />
          </div>
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-azul-600 text-white rounded-lg hover:bg-azul-700 disabled:opacity-60"
        >
          {saving ? "Updating..." : "Update Planner"}
        </button>
      </form>
    </main>
  );
}
