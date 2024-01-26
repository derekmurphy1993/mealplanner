const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    nutrition: {
        calories: Number,
        carb: Number,
        fat: Number,
        protein: Number
    },
});

const FoodModel = mongoose.model("recipes", foodSchema);
module.exports = FoodModel;