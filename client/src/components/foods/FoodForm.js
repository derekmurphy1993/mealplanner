// add a new meal
import React, {useState} from 'react';

export const FoodForm = ({addNewMeal}) => {
    const [recipeInfo, setRecipeInfo] = useState({
      name: "",
      recipeUrl: "",
      cals: 0,
      carbs: 0,
      prots: 0,
      fats: 0
    });

    const handleChange = (e) => {
        const {name, value} = (e.target)
        setRecipeInfo((prev) => {

          return{...prev, [name]: value}
        })
      }
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(recipeInfo);
        addNewMeal(recipeInfo);
    }


    return (
        <form className='foodForm' onSubmit={handleSubmit}>
          <h3>Recipe Name:</h3>{" "}
            <input type="text" name='name' placeholder='Add a New Meal' 
             onChange={handleChange}/>
          <h3>URL:</h3>{" "}
            <input type="text" name='recipeUrl' placeholder='Link to Recipe' 
              onChange={handleChange}/>
          <h3>Calories:</h3>{" "}
            <input type="number" name='cals' placeholder='Add a New Meal' 
              onChange={handleChange}/>
          <h3>Carbs:</h3>{" "}
            <input type="number" name='carbs' placeholder='Carbs in grams' 
             onChange={handleChange}/>
          <h3>Protein:</h3>{" "}
            <input type="number" name='prots' placeholder='Protien in grams' 
             onChange={handleChange}/>
          <h3>Fats:</h3>{" "}
            <input type="number" name='fats' placeholder='Fats in grams' 
             onChange={handleChange}/>
                     <button type="submit" className="foodBtn"> Add New Meal </button>
         </form>
    );
  };
