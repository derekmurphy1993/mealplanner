import { useEffect } from "react";
import {
	GoogleAuthProvider,
	getAuth,
	getRedirectResult,
	signInWithRedirect,
} from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";

export default function OAuth() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		const handleGoogleRedirect = async () => {
			try {
				const auth = getAuth(app);
				const result = await getRedirectResult(auth);

				if (!result?.user) return;

				const res = await apiFetch("/api/auth/google", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						name: result.user.displayName,
						email: result.user.email,
						photo: result.user.photoURL,
					}),
				});
				const data = await res.json();
				dispatch(signInSuccess(data));
				navigate("/");
			} catch (err) {
				console.log("Could not complete Google redirect sign in", err);
			}
		};

		handleGoogleRedirect();
	}, [dispatch, navigate]);

	const handleGoogle = async () => {
		try {
			const provider = new GoogleAuthProvider();
			const auth = getAuth(app);
			await signInWithRedirect(auth, provider);
		} catch (err) {
			console.log("Could not sign in with google", err);
		}
	};

	return (
		<button
			type="button"
			onClick={handleGoogle}
			className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-90"
		>
			Continue with Google
		</button>
	);
}
