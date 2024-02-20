const express = require("express");
const app = express();
const session = require('express-session');
const mongoose = require('mongoose');
const mongoURI = require("./config/dev")
const userModel = require("./models/Users")
const passport = require('passport');
require('./auth');

const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(session({ secret: 'enviovariablenotsource' }));
// flesh out depreciation using express-session docs
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);

mongoose.connect(mongoURI.mongoURI)
// should i use mongoDB compass? 

app.get('/', (req, res) => {
    res.send(`<a href="/auth/google"> authenticate w google</a>`);
});

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