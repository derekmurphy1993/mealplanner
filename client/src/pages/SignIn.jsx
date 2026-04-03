import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
	signInStart,
	signInSuccess,
	signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
import { apiFetch } from "../utils/api";
import { DEMO_USER, getDemoTargetPath } from "../utils/demoMode";

export default function SignIn() {
	const [formData, setFormData] = useState({});
	const { loading, error } = useSelector((state) => state.user);
	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useDispatch();
	const protectedTarget = location.state?.from || "";

	const onChangeHandler = (e) => {
		setFormData({
			...formData,
			[e.target.id]: e.target.value,
		});
	};

	const onSubmitHandler = async (e) => {
		e.preventDefault();
		try {
			dispatch(signInStart());
			const res = await apiFetch("/api/auth/signin", {
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
			navigate(protectedTarget || "/");
		} catch (error) {
			dispatch(signInFailure(error.message));
		}
	};

	const handleDemoMode = () => {
		dispatch(signInSuccess(DEMO_USER));
		navigate(getDemoTargetPath(protectedTarget), { replace: true });
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
				<OAuth />
			</form>
			<div className="flex gap-2 mt-5">
				<p>Need an account? </p>
				<Link to={"/sign-up"}>
					<span className="text-blue-500">Sign Up</span>
				</Link>
			</div>
			{protectedTarget && (
				<div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
					<p className="font-medium text-slate-800">Trying a protected page?</p>
					<p className="mt-1 text-sm text-slate-600">
						You can continue in read-only demo mode to preview the planner,
						recipe book, and profile experience.
					</p>
					<button
						type="button"
						onClick={handleDemoMode}
						className="mt-3 w-full rounded-lg bg-leaf-400 p-3 font-semibold uppercase text-azul-900 hover:bg-leaf-500"
					>
						Continue In Demo Mode
					</button>
				</div>
			)}
			{error && <p className="text-red-500 mt-5">{error}</p>}
		</div>
	);
}
