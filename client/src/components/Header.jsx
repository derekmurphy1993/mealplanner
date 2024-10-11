import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <header className="bg-blue-800 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
          FoodPlanner
        </h1>
        <form className="bg-slate-100 p-3 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="search meals..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />
          <FaSearch className="text-slate-500" />
        </form>
        <ul className="flex gap-4">
          <Link to={`/`}>
            <li className="hidden sm:inline text-slate-300 hover:underline">
              Home
            </li>
          </Link>
          <Link to={`/my-planner`}>
            <li className="hidden sm:inline text-slate-300 hover:underline">
              My Planner
            </li>
          </Link>
          <Link to={`/recipe-book`}>
            <li className="hidden sm:inline text-slate-300 hover:underline">
              Recipe Book
            </li>
          </Link>
          <Link to={`/profile`}>
            {currentUser ? (
              <img
                src={currentUser.avatar}
                className="rounded-full h-7 w-7 object-cover"
                alt="profile picture"
              />
            ) : (
              <li className=" text-slate-700 hover:underline">Sign In</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
