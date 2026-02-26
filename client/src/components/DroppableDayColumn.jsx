/* eslint-disable react/prop-types */
import { useDroppable } from "@dnd-kit/react";
import { CollisionPriority } from "@dnd-kit/abstract";
import SortableMealCard from "./SortableMealCard";

const DAY_LABELS = {
  pool: "Your meals",
  Monday: "Monday",
  Tuesday: "Tuesday",
  Wednesday: "Wednesday",
  Thursday: "Thursday",
  Friday: "Friday",
};

export default function DroppableDayColumn({
  columnId,
  mealIds,
  mealsById,
  isPool,
}) {
  const { ref, isDropTarget } = useDroppable({
    id: columnId,
    type: "column",
    accept: "item",
    collisionPriority: CollisionPriority.Low,
  });

  const label = DAY_LABELS[columnId] ?? columnId;

  return (
    <div
      ref={ref}
      className={`
        flex flex-col flex-1 min-w-[200px] max-w-[280px] rounded-xl border-2 p-4 min-h-[320px]
        transition-colors duration-150
        ${isPool ? "bg-slate-100 border-slate-300" : "bg-white border-gray-200"}
        ${isDropTarget ? "ring-2 ring-azul-400 bg-azul-50/50 border-azul-300" : ""}
      `}
    >
      <h2 className="font-bold text-lg border-b-2 border-gray-200 pb-2 mb-3 text-gray-800">
        {label}
      </h2>
      <div className="flex flex-col gap-3 flex-1">
        {mealIds.length === 0 && (
          <p className="text-gray-400 text-sm py-4 text-center">
            {isPool ? "Add meals in Recipe Book" : "Drop meals here"}
          </p>
        )}
        {mealIds.map((mealId, index) => {
          const meal = mealsById[mealId];
          if (!meal) return null;
          return (
            <SortableMealCard
              key={mealId}
              meal={meal}
              index={index}
              columnId={columnId}
            />
          );
        })}
      </div>
    </div>
  );
}
