import React from "react";

export default function OAuth() {
	const handleGoogle = async () => {
		try {
			const provider = new GoogleAuthProvider();
		} catch (err) {
			console.log("Could not sign in with google", error);
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
