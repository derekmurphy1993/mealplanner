/* eslint-disable react/prop-types */
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

export default function MealSearchModal({
  day,
  meals,
  onClose,
  onAddMeal,
  addingMealId,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [showFilters, setShowFilters] = useState(false);

  const visibleMeals = useMemo(() => {
    const list = Array.isArray(meals) ? [...meals] : [];
    const query = searchTerm.trim().toLowerCase();

    const filtered = query
      ? list.filter((meal) => (meal?.name || "").toLowerCase().includes(query))
      : list;

    if (sortOption === "calories_desc") {
      filtered.sort((a, b) => Number(b?.calories || 0) - Number(a?.calories || 0));
    } else if (sortOption === "calories_asc") {
      filtered.sort((a, b) => Number(a?.calories || 0) - Number(b?.calories || 0));
    } else if (sortOption === "protein_desc") {
      filtered.sort((a, b) => Number(b?.prots || 0) - Number(a?.prots || 0));
    }

    return filtered;
  }, [meals, searchTerm, sortOption]);

  if (!day) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Your Meals ({day})
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="mb-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search meals..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={() => setShowFilters((prev) => !prev)}
              className="h-9 w-9 shrink-0 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
              aria-label="Toggle filters"
              title="Toggle filters"
            >
              ☰
            </button>
          </div>
          {showFilters && (
            <div className="mt-2">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="default">Default order</option>
                <option value="calories_desc">Most calories</option>
                <option value="calories_asc">Least calories</option>
                <option value="protein_desc">Most protein</option>
              </select>
            </div>
          )}
        </div>

        {Array.isArray(meals) && meals.length > 0 && visibleMeals.length > 0 ? (
          <ul className="max-h-80 overflow-y-auto space-y-2 text-sm text-gray-700">
            {visibleMeals.map((meal) => (
              <li
                key={meal._id}
                className="border border-gray-100 rounded-md px-3 py-2 flex items-center justify-between gap-3"
              >
                <div>
                  {meal?._id ? (
                    <Link
                      to={`/meal/${meal._id}`}
                      className="font-medium text-azul-700 hover:underline"
                    >
                      {meal.name}
                    </Link>
                  ) : (
                    <p className="font-medium text-gray-800">{meal.name}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    {meal?.calories ?? 0} cal | {meal?.prots ?? 0}g protein |{" "}
                    {meal?.carbs ?? 0}g carbs | {meal?.fats ?? 0}g fats
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onAddMeal?.(meal._id)}
                  disabled={Boolean(addingMealId)}
                  className="h-6 w-6 rounded-full bg-green-600 text-white text-sm leading-none font-bold hover:bg-green-700 disabled:opacity-60"
                  aria-label={`Add ${meal.name} to ${day}`}
                  title={`Add ${meal.name} to ${day}`}
                >
                  {addingMealId === meal._id ? "…" : "+"}
                </button>
              </li>
            ))}
          </ul>
        ) : Array.isArray(meals) && meals.length > 0 ? (
          <p className="text-sm text-gray-500">No meals match your search.</p>
        ) : (
          <p className="text-sm text-gray-500">No meals found.</p>
        )}
      </div>
    </div>
  );
}
