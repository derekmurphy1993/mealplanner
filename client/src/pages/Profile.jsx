import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { app } from "../firebase";
import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from "firebase/storage";
import {
	updateUserStart,
	updateUserFailure,
	updateUserSuccess,
	deleteUserFailure,
	deleteUserStart,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

export default function Profile() {
	const { currentUser, loading, error } = useSelector((state) => state.user);
	const [file, setFile] = useState(undefined);
	const [filePerc, setFilePerc] = useState(0);
	const [fileUploadError, setFileUploadError] = useState(false);
	const [formData, setFormData] = useState({});
	const [updateSuccess, setUpdateSuccess] = useState(false);
	const dispatch = useDispatch();

	const fileRef = useRef(null);
	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			dispatch(updateUserStart());
			const res = await fetch(`/api/user/update/${currentUser._id}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			if (data.success === false) {
				dispatch(updateUserFailure(data.message));
				return;
			}
			dispatch(updateUserSuccess(data));
			setUpdateSuccess(true);
		} catch (error) {
			dispatch(updateUserFailure(error.message));
		}
	};
	const handleDeleteUser = async () => {
		try {
			dispatch(deleteUserStart());
			const res = await fetch(`/api/user/delete/${currentUser._id}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (data.success === false) {
				dispatch(deleteUserFailure(data.message));
				return;
			}

			dispatch(deleteUserSuccess(data));
		} catch (error) {
			dispatch(deleteUserFailure(error.message));
		}
	};
	const handleSignOut = () => {};

	console.log(formData);
	console.log(filePerc);
	console.log(fileUploadError);

	useEffect(() => {
		if (file) {
			handleFileUpload(file);
		}
	}, [file]);

	const handleFileUpload = (file) => {
		const storage = getStorage(app);
		const fileName = new Date().getTime() + file.name;
		const storageRef = ref(storage, fileName);
		const uploadTask = uploadBytesResumable(storageRef, file);

		uploadTask.on(
			"state_changed",
			(snapshot) => {
				const progress =
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				setFilePerc(Math.round(progress));
			},
			(error) => {
				setFileUploadError(true);
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
					setFormData({ ...formData, avatar: downloadUrl });
				});
			}
		);
	};

	return (
		<div className="p-3 max-w-large mx-auto">
			<h1 className="font-semibold text-3xl text-center my-7">Profile</h1>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<input
					type="file"
					ref={fileRef}
					hidden
					accept="image/*"
					onChange={(e) => setFile(e.target.files[0])}
				/>
				<img
					onClick={() => fileRef.current.click()}
					className="rounded-full h-24 w-24 object-cover border-red-200 cursor-pointer self-center mt-2"
					src={currentUser.avatar}
				/>

				<input
					type="text"
					id="username"
					placeholder="username"
					defaultValue={currentUser.username}
					className="border p-3 rounded-lg"
					onChange={handleChange}
				/>
				<input
					type="text"
					id="email"
					placeholder="email"
					defaultValue={currentUser.email}
					className="border p-3 rounded-lg"
					onChange={handleChange}
				/>
				<input
					type="password"
					id="password"
					placeholder="password"
					className="border p-3 rounded-lg"
				/>
				<button
					disabled={loading}
					className="bg-slate-700 text-white rounded-lg 
          p-3 uppercase hover:opacity-90 disabled:opacity-80"
				>
					{loading ? "loading..." : "Update"}
				</button>
			</form>
			<div className="flex justify-between mt-5">
				<span
					onClick={handleDeleteUser}
					className="text-red-700 cursor-pointer"
				>
					{" "}
					Delete Account{" "}
				</span>
				<span onClick={handleSignOut} className="text-red-700 cursor-pointer">
					{" "}
					Sign Out{" "}
				</span>
			</div>
			<p className="text-red-700 mt-5">{error ? error : ""}</p>
			<p className="text-green-700 mt-5">{updateSuccess ? "Updated" : ""}</p>
		</div>
	);
}
