import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Planner from "./pages/Planner";
import Profile from "./pages/Profile";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/sign-in" element={<SignIn />} />
				<Route path="/sign-up" element={<SignUp />} />
				<Route path="/plan" element={<Planner />} />
				<Route path="/profile" element={<Profile />} />
			</Routes>
		</BrowserRouter>
	);
}
