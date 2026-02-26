/* eslint-disable react/prop-types */
import { useSortable } from "@dnd-kit/react/sortable";
import MealCard from "./MealCard";

export default function SortableMealCard({ meal, index, columnId }) {
  const { ref, isDragging } = useSortable({
    id: meal._id,
    index,
    type: "item",
    accept: "item",
    group: columnId,
  });

  return (
    <div
      ref={ref}
      className={isDragging ? "opacity-50 scale-95" : ""}
      style={{ transition: "opacity 0.2s, transform 0.2s" }}
    >
      <MealCard meal={meal} />
    </div>
  );
}
