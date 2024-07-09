import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
	signInStart,
	signInSuccess,
	signInFailure,
} from "../redux/user/userSlice";

export default function SignIn() {
	const [formData, setFormData] = useState({});
	const { loading, error } = useSelector((state) => state.user);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const onChangeHandler = (e) => {
		setFormData({
			...formData,
			[e.target.id]: e.target.value,
		});
	};

	console.log(formData);

	const onSubmitHandler = async (e) => {
		e.preventDefault();
		try {
			dispatch(signInStart());
			const res = await fetch("/api/auth/signin", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			if (data.success === false) {
				dispatch(signInFailure(data.message));
				return;
			}
			dispatch(signInSuccess(data));
			navigate("/");
		} catch (error) {
			dispatch(signInFailure(data.message));
		}
	};

	return (
		<div className="p-3 max-w-lg mx-auto">
			<h1 className="text-3xl text-center font font-semibold my-7">Sign In</h1>
			<form onSubmit={onSubmitHandler} className="flex flex-col gap-4 ">
				<input
					type="email"
					placeholder="email"
					className="border p-3 rounded-lg"
					id="email"
					onChange={onChangeHandler}
				/>
				<input
					type="password"
					placeholder="password"
					className="border p-3 rounded-lg"
					id="password"
					onChange={onChangeHandler}
				/>
				<button
					disabled={loading}
					className="bg-slate-500 p-3 text-white rounded-lg uppercase hover:opacity-90 disabled:opacity-80"
				>
					{loading ? "loading..." : "sign in"}
				</button>
			</form>
			<div className="flex gap-2 mt-5">
				<p>Need an account? </p>
				<Link to={"/sign-up"}>
					<span className="text-blue-500">Sign Up</span>
				</Link>
			</div>
			{error && <p className="text-red-500 mt-5">{error}</p>}
		</div>
	);
}
