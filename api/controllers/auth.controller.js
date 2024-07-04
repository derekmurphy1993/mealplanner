import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res) => {
	const { username, email, password } = req.body;
	const hashedPass = bcryptjs.hashSync(password, 10);
	const newUser = new User({ username, email, hashedPass });
	try {
		await newUser.save();
		res.status(201).json("User created successfully.");
	} catch (error) {
		next(error);
	}
};
