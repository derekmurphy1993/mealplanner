const express = require("express");
const app = express();
const mongoose = require('mongoose');
const mongoURI = require("../config/dev")
const userModel = require("./models/Users")

mongoose.connect(mongoURI)
// should i use mongoDB compass? 

app.get('getUsers', (req, res) => {
    userModel.find({}, (err, result) => {
        if (err) {
            res.json(err)
        } else {
            res.json(result) 
        }

    })
});

app.post("/createUser", (req, res) => {
    
})

app.listen(3001, () => {
    console.log("server running")
});