import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Planner from "./pages/Planner";
import CreatePlanner from "./pages/CreatePlanner";
import UpdatePlanner from "./pages/UpdatePlanner";
import Profile from "./pages/Profile";
import CreateMeal from "./pages/CreateMeal";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import Meal from "./pages/Meal";
import RecipeBook from "./pages/RecipeBook";
import UpdateMeal from "./pages/UpdateMeal";
import Search from "./components/Search";
import { apiFetch } from "./utils/api";
import { signInSuccess, signOutUserSuccess } from "./redux/user/userSlice";

export default function App() {
  const dispatch = useDispatch();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    let ignore = false;

    const validateSession = async () => {
      try {
        const res = await apiFetch("/api/auth/me");

        if (!res.ok) {
          if (!ignore) {
            dispatch(signOutUserSuccess());
          }
          return;
        }

        const data = await res.json();
        if (!ignore) {
          dispatch(signInSuccess(data.user));
        }
      } catch (error) {
        if (!ignore) {
          dispatch(signOutUserSuccess());
        }
      } finally {
        if (!ignore) {
          setAuthChecked(true);
        }
      }
    };

    validateSession();

    return () => {
      ignore = true;
    };
  }, [dispatch]);

  if (!authChecked) {
    return null;
  }

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/search" element={<Search />} />
        <Route path="/meal/:mealId" element={<Meal />} />
        <Route element={<PrivateRoute />}>
          <Route path="/my-planner" element={<Planner />} />
          <Route path="/create-planner" element={<CreatePlanner />} />
          <Route path="/update-planner/:plannerId" element={<UpdatePlanner />} />
          <Route path="/recipe-book" element={<RecipeBook />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-meal" element={<CreateMeal />} />
          <Route path="/update-meal/:mealId" element={<UpdateMeal />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
