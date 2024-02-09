import React from 'react'

export const FoodItem = ({food}) => {
    return (
        <div className="FoodList">
            <p> {food.name} </p>
        </div>
    )
}