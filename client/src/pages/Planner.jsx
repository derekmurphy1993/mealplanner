import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { BiDuplicate } from "react-icons/bi";
import MealSearchModal from "../components/MealSearchModal";
import { apiFetch } from "../utils/api";

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

export default function Planner() {
  const { currentUser } = useSelector((state) => state.user);
  const [planners, setPlanners] = useState([]);
  const [userMeals, setUserMeals] = useState([]);
  const [selectedPlannerId, setSelectedPlannerId] = useState("");
  const [modalDay, setModalDay] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingMealId, setAddingMealId] = useState("");
  const [dayMealActionKey, setDayMealActionKey] = useState("");

  useEffect(() => {
    const fetchPlanners = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await apiFetch("/api/planner/");
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
        const res = await apiFetch(`/api/user/meals/${currentUser._id}`);
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
    [planners, selectedPlannerId],
  );

  const handlePrintShoppingList = () => {
    if (!selectedPlanner) return;

    const weekMeals = (selectedPlanner.week || [])
      .flatMap((dayObj) => (Array.isArray(dayObj.meals) ? dayObj.meals : []))
      .filter((meal) => meal && typeof meal === "object");

    const ingredientTotals = new Map();
    const ingredientEntries = [];
    const mealsWithoutIngredients = new Map();

    weekMeals.forEach((meal) => {
      const ingredients = Array.isArray(meal?.recipe?.ingredients)
        ? meal.recipe.ingredients
        : [];

      let hasAnyIngredientInfo = false;

      ingredients.forEach((ing) => {
        const itemName = String(ing?.itemName || "").trim();
        if (!itemName) return;

        hasAnyIngredientInfo = true;
        const unit = String(ing?.itemUnit || "").trim();
        const parsedAmount = Number(ing?.itemAmount);
        const hasNumericAmount = Number.isFinite(parsedAmount);

        if (hasNumericAmount) {
          const key = `${itemName}||${unit}`;
          const existing = ingredientTotals.get(key) || {
            itemName,
            unit,
            total: 0,
          };
          existing.total += parsedAmount;
          ingredientTotals.set(key, existing);
          return;
        }

        ingredientEntries.push({
          itemName,
          unit,
          amountText: "",
        });
      });

      if (!hasAnyIngredientInfo) {
        const mealKey =
          meal?._id || meal?.name || `missing-${mealsWithoutIngredients.size}`;
        mealsWithoutIngredients.set(mealKey, meal?.name || "Unnamed meal");
      }
    });

    const summedEntries = Array.from(ingredientTotals.values()).map(
      (entry) => ({
        itemName: entry.itemName,
        unit: entry.unit,
        amountText: Number.isInteger(entry.total)
          ? String(entry.total)
          : String(Number(entry.total.toFixed(2))),
      }),
    );

    const sortedEntries = [...summedEntries, ...ingredientEntries].sort(
      (a, b) => {
        const byName = a.itemName.localeCompare(b.itemName, undefined, {
          sensitivity: "base",
        });
        if (byName !== 0) return byName;
        return a.unit.localeCompare(b.unit, undefined, { sensitivity: "base" });
      },
    );

    const ingredientListMarkup =
      sortedEntries.length > 0
        ? sortedEntries
            .map(
              (entry) =>
                `<li>${escapeHtml(
                  [entry.amountText, entry.unit, entry.itemName]
                    .filter(Boolean)
                    .join(" "),
                )}</li>`,
            )
            .join("")
        : "<li>No ingredients found for this week.</li>";

    const missingMealsMarkup =
      mealsWithoutIngredients.size > 0
        ? Array.from(mealsWithoutIngredients.values())
            .map((mealName) => `<li>${escapeHtml(mealName)}</li>`)
            .join("")
        : "<li>None</li>";

    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) {
      setError("Unable to open print window.");
      return;
    }

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Shopping List</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 24px; color: #111827; }
            h1 { margin: 0 0 8px; }
            h2 { margin: 24px 0 8px; }
            p { margin: 0 0 12px; color: #374151; }
            ul { margin: 0; padding-left: 20px; }
            li { margin: 4px 0; }
          </style>
        </head>
        <body>
          <h1>${escapeHtml(selectedPlanner.name || "Weekly Planner")} Shopping List</h1>
          <p>Generated from all meals in this week.</p>
          <h2>Ingredients</h2>
          <ul>${ingredientListMarkup}</ul>
          <h2>the following meals do not have ingredient information</h2>
          <ul>${missingMealsMarkup}</ul>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 150);
  };

  const persistPlannerWeek = async (week, fallbackErrorMessage) => {
    if (!selectedPlanner?._id) return false;

    const payload = {
      plannerLength: selectedPlanner.plannerLength,
      name: selectedPlanner.name || "",
      week,
    };

    const res = await apiFetch(`/api/planner/${selectedPlanner._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok || data.success === false) {
      setError(data.message || fallbackErrorMessage);
      return false;
    }

    setPlanners((prev) =>
      prev.map((planner) =>
        planner._id === selectedPlanner._id ? data : planner,
      ),
    );
    return true;
  };

  const handleAddMealToDay = async (mealId) => {
    if (!selectedPlanner?._id || !modalDay || !mealId || addingMealId) return;

    setAddingMealId(mealId);
    setError("");

    try {
      const week = (selectedPlanner.week || []).map((dayObj) => {
        const meals = Array.isArray(dayObj.meals)
          ? dayObj.meals
              .map((meal) => (typeof meal === "object" ? meal?._id : meal))
              .filter(Boolean)
          : [];

        if (dayObj.day !== modalDay) {
          return {
            ...dayObj,
            meals,
          };
        }

        return {
          ...dayObj,
          meals: [...meals, mealId],
        };
      });

      const saved = await persistPlannerWeek(week, "Problem adding meal.");
      if (saved) setModalDay("");
    } catch (err) {
      setError(err.message || "Problem adding meal.");
    } finally {
      setAddingMealId("");
    }
  };

  const handleRemoveMealFromDay = async (day, mealIndex) => {
    if (!selectedPlanner?._id || !day || dayMealActionKey) return;

    const actionKey = `${day}-${mealIndex}-remove`;
    setDayMealActionKey(actionKey);
    setError("");

    try {
      const week = (selectedPlanner.week || []).map((dayObj) => {
        const meals = Array.isArray(dayObj.meals)
          ? dayObj.meals
              .map((meal) => (typeof meal === "object" ? meal?._id : meal))
              .filter(Boolean)
          : [];

        if (dayObj.day !== day) {
          return {
            ...dayObj,
            meals,
          };
        }

        return {
          ...dayObj,
          meals: meals.filter((_, index) => index !== mealIndex),
        };
      });

      await persistPlannerWeek(week, "Problem removing meal.");
    } catch (err) {
      setError(err.message || "Problem removing meal.");
    } finally {
      setDayMealActionKey("");
    }
  };

  const handleDuplicateMealInDay = async (day, mealIndex) => {
    if (!selectedPlanner?._id || !day || dayMealActionKey) return;

    const actionKey = `${day}-${mealIndex}-duplicate`;
    setDayMealActionKey(actionKey);
    setError("");

    try {
      const week = (selectedPlanner.week || []).map((dayObj) => {
        const meals = Array.isArray(dayObj.meals)
          ? dayObj.meals
              .map((meal) => (typeof meal === "object" ? meal?._id : meal))
              .filter(Boolean)
          : [];

        if (dayObj.day !== day) {
          return {
            ...dayObj,
            meals,
          };
        }

        if (!meals[mealIndex]) {
          return {
            ...dayObj,
            meals,
          };
        }

        const duplicatedMeals = [...meals];
        duplicatedMeals.splice(mealIndex + 1, 0, meals[mealIndex]);

        return {
          ...dayObj,
          meals: duplicatedMeals,
        };
      });

      await persistPlannerWeek(week, "Problem duplicating meal.");
    } catch (err) {
      setError(err.message || "Problem duplicating meal.");
    } finally {
      setDayMealActionKey("");
    }
  };

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
          <div className="mb-6 flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {selectedPlanner.name || "Planner"}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {selectedPlanner.plannerLength}-day planner
              </p>
            </div>
            <button
              type="button"
              onClick={handlePrintShoppingList}
              className="px-3 py-1.5 text-xs rounded-md bg-azul-600 text-white hover:bg-azul-700"
            >
              Print Shopping List
            </button>
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
                            Carbohydrates
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
                          Carbohydrates
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
                      <ul className="text-sm text-gray-700 space-y-2">
                        {dayObj.meals.map((meal, index) => (
                          <li
                            key={`${dayObj.day}-${meal?._id || "missing"}-${index}`}
                            className="border border-gray-100 rounded-md px-3 py-2 flex items-center justify-between gap-3"
                          >
                            <div>
                              {meal?._id ? (
                                <Link
                                  to={`/meal/${meal._id}`}
                                  className="font-medium text-azul-700 hover:underline"
                                >
                                  {meal?.name || "Missing meal"}
                                </Link>
                              ) : (
                                <p className="font-medium text-gray-800">
                                  {meal?.name || "Missing meal"}
                                </p>
                              )}
                              <p className="text-xs text-gray-500">
                                {meal?.calories ?? 0} cal | {meal?.prots ?? 0}g{" "}
                                protein | {meal?.carbs ?? 0}g carbohydrates |{" "}
                                {meal?.fats ?? 0}g fats
                              </p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveMealFromDay(dayObj.day, index)
                                }
                                disabled={Boolean(dayMealActionKey)}
                                className="h-6 w-6 rounded-full bg-red-600 text-white text-sm leading-none font-bold hover:bg-red-700 disabled:opacity-60"
                                aria-label={`Remove ${meal?.name || "meal"} from ${dayObj.day}`}
                                title={`Remove ${meal?.name || "meal"} from ${dayObj.day}`}
                              >
                                -
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleDuplicateMealInDay(dayObj.day, index)
                                }
                                disabled={Boolean(dayMealActionKey)}
                                className="h-6 w-6 rounded-full bg-green-600 text-white text-xs font-bold hover:bg-green-700 disabled:opacity-60 flex items-center justify-center"
                                aria-label={`Duplicate ${meal?.name || "meal"} in ${dayObj.day}`}
                                title={`Duplicate ${meal?.name || "meal"} in ${dayObj.day}`}
                              >
                                <BiDuplicate />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No meals assigned.
                      </p>
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

      <MealSearchModal
        day={modalDay}
        meals={userMeals}
        onAddMeal={handleAddMealToDay}
        addingMealId={addingMealId}
        onClose={() => setModalDay("")}
      />
    </div>
  );
}
