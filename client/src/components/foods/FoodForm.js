// add a new meal
import React, {useState} from 'react';

export const FoodForm = ({addNewMeal}) => {
    const [value, setValue] = useState("");

    const handleChange = (e) => {
        console.log(e.target.value)
        setValue(e.target.value)
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        addNewMeal(value);
        setValue("");
    }


    return (
        <form className='foodForm' onSubmit={handleSubmit}>
            <input type="text" className='foodInput' placeholder='Add a New Meal' 
            value={value} onChange={handleChange}/>
                     <button type="submit" className="foodBtn"> Add New Meal </button>
         </form>
    );
  };
