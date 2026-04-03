import { useSelector } from "react-redux";
import { Outlet, Navigate, useLocation } from "react-router-dom";

export default function PrivateRoute() {
	const location = useLocation();
	const { currentUser } = useSelector((state) => state.user);
	return currentUser ? (
		<Outlet />
	) : (
		<Navigate
			to="/sign-in"
			state={{ from: location.pathname }}
			replace
		/>
	);
}
