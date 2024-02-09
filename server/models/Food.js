const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    nutrition: {
        calories: Number,
        carb: Number,
        fat: Number,
        protein: Number
    },
});

const FoodModel = mongoose.model("foods", foodSchema);
module.exports = FoodModel;