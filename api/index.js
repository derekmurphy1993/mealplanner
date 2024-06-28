import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose
	.connect(process.env.MONGO)
	.then(console.log("connected to DB"))
	.catch("error connecting to db");
const app = express();

app.listen(3000, () => {
	console.log(`Server Running on port 3000`);
});
