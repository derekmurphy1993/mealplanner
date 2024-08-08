import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const test = (req, res) => {
	res.json({
		message: "hello",
	});
};

export const updateUser = async (req, res, next) => {
	if (req.user.id !== req.params.id)
		return next(errorHandler(401, "You cannot update this account"));

	try {
		if (req.body.password) {
			req.body.password = bcryptjs.hashSync(req.body.password, 10);
		}

		const updatedUser = await User.findByIdAndUpdate(
			req.params.id,
			// do not just "$set" leaves oppertunity to change other info
			{
				$set: {
					username: req.body.username,
					email: req.body.password,
					password: req.body.password,
					avatar: req.body.avatar,
				},
			},
			{ new: true }
		);

		const { password, ...rest } = updatedUser._doc;
		res.status(200).json(rest);
	} catch (error) {}
};

export const deleteUser = async (req, res, next) => {
	if (req.user.id !== req.params.id)
		return next(errorHandler(401, "You can only delete your own account!"));
	try {
		await User.findByIdAndDelete(req.params.id);
		res.status(200).json("user has been deleted");
	} catch (error) {
		next(error);
	}
};
