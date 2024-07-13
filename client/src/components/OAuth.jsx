import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";

export default function OAuth() {
	const dispatch = useDispatch();
	const handleGoogle = async () => {
		try {
			const provider = new GoogleAuthProvider();
			const auth = getAuth(app);

			const result = await signInWithPopup(auth, provider);

			const res = await fetch("/api/auth/google", {
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
			console.log(data);
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
