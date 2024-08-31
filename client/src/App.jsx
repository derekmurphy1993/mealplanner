import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Planner from "./pages/Planner";
import Profile from "./pages/Profile";
import CreateMeal from "./pages/CreateMeal";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
	return (
		<BrowserRouter>
			<Header />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/sign-in" element={<SignIn />} />
				<Route path="/sign-up" element={<SignUp />} />
				<Route path="/my-planner" element={<Planner />} />
				<Route element={<PrivateRoute />}>
					<Route path="/profile" element={<Profile />} />
					<Route path="/create-meal" element={<CreateMeal />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}
