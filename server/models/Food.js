const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true
    },
    username: {
        type: String,
        required: true
    },
});

const FoodModel = mongoose.model("recipes", foodSchema);
module.exports = FoodModel;