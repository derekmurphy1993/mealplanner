const express = require("express");
const app = express();
const mongoose = require('mongoose');
const mongoURI = require("../config/dev")
const userModel = require("./models/Users")

const cors = require("cors");
app.use(cors());
app.use(express.json());

mongoose.connect(mongoURI)
// should i use mongoDB compass? 

require('./routes/foodRoutes')(app);

app.get('getUsers', (req, res) => {
    userModel.find({}, (err, result) => {
        if (err) {
            res.json(err)
        } else {
            res.json(result) 
        }

    })
});

app.post("/createUser", async (req, res) => {
    const user = req.body;
    const newUser = new UserModel(user);
    // wierd syntax but how mongo will save
    await newUser.save();

    res.json(user);
})

app.listen(3001, () => {
    console.log("server running")
});