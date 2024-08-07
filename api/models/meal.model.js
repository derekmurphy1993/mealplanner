import mongoose from "mongoose";

const mealSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		calories: {
			type: Number,
			required: true,
		},
		carbs: {
			type: Number,
		},
		fats: {
			type: Number,
		},
		prots: {
			type: Number,
		},
		image: {
			type: String,
			default:
				"https://static.wikia.nocookie.net/avatar/images/a/ae/Aang_at_Jasmine_Dragon.png/revision/latest?cb=20130612174003",
		},
		ingredients: {
			Name: { type: String },
			Measurement: "300g",
		},
	},
	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
