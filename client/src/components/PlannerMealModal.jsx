/* eslint-disable react/prop-types */
export default function PlannerMealModal({ day, meals, onClose }) {
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
        {Array.isArray(meals) && meals.length > 0 ? (
          <ul className="max-h-80 overflow-y-auto space-y-1 text-sm text-gray-700">
            {meals.map((meal) => (
              <li key={meal._id} className="border-b border-gray-100 pb-1">
                {meal.name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No meals found.</p>
        )}
      </div>
    </div>
  );
}
