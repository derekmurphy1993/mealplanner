import React, {useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import Axios from "axios";
import {v4 as uuidv4} from 'uuid';
import { FoodForm } from './foods/FoodForm';
import { FoodItem } from './foods/FoodItem';

export const TestBody = () => {
    const [listOfFoods, setListOfFoods] = useState([{}])

    const addNewMeal = food => {
        setListOfFoods([...listOfFoods, 
            {id: uuidv4(),
            name: food.name,
            url: food.url,
            cals: food.cals,
            carbs: food.carbs, 
            prots: food.prots, 
            fats: food.fats, 
            completed: false,
            isEditing: false}])
            console.log(listOfFoods)
    }


    // useEffect(() => {
    //     Axios.get("/getFoods").then((res) => {
    //         setListOfFoods(res.data)
    //     })
    // }, [])

    // const onPressGet = () => {
    //     console.log('GET')
    // }

    // const onPressNew = () => {
    //     console.log('NEW')

    //     Axios.post("http://localhost:3001/createFood", {
    //         name: "",
    //         date: new Date()
    //     }).then((res) => {
    //         alert("did it")
    //     })
    // }
return (
    <div>
    <div className="newFoodWrapper"> 
        <FoodForm addNewMeal={addNewMeal} />
    </div>
    {listOfFoods.map((item, index) => {
       return <FoodItem food={item} key={index}/>
    } )}
    </div>
)
};