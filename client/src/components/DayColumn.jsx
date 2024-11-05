/* eslint-disable react/prop-types */
import MealCard from "./MealCard";

export default function DayColumn({ day }) {
  const meals = day.meals;

  console.log("meals ", meals);

  return (
    <div className="m-8 border-gray-300 border-2 rounded-md w-10/12">
      <h1 className="font-bold border-b-2"> {day.day} </h1>
      {meals &&
        meals.length > 0 &&
        meals.map((meal, index) => (
          <MealCard
            key={meal._id + day.day + index}
            meal={meal}
            index={index}
          />
        ))}
    </div>
  );
}
