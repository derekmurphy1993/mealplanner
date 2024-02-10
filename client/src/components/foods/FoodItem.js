import React from 'react'

export const FoodItem = ({food}) => {
    if (!food.name) {return}
    return (
        <div className="FoodList">
            <h4> {food.name} </h4>
            <p> {food.url} </p>
            <p> Calories: {food.cals} </p>
            <p> Carbs: {food.carbs} </p>
            <p> Protien: {food.prots} </p>
            <p> Fats: {food.fats} </p>
        </div>
    )
}