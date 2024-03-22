import React from 'react';
import Button from '@mui/material/Button';
import Axios from "axios";

export const Header = () => {
return(
    <div style={{backgroundColor: 'blue', height: "8vh"}}>  
    <h2 style={{color: 'white', fontWeight: "bold"}}>
        Food App
    </h2>
    <a href="http://localhost:3001/auth/google">Log In</a>
    </div>
)
};