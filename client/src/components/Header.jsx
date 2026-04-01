import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <header className="shadow-md bg-slate-100">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-chili text-sm sm:text-xl ml-3 flex flex-wrap hover:opacity-80">
            Macro <span className="text-leaf-700">Planner</span>
          </h1>
        </Link>
        <ul className="flex gap-4 text-azul-700">
          <Link to={`/`}>
            <li className="hidden sm:inline  hover:underline">Home</li>
          </Link>
          <Link to={`/my-planner`}>
            <li className="hidden sm:inline hover:underline">My Planner</li>
          </Link>
          <Link to={`/recipe-book`}>
            <li className="hidden sm:inline hover:underline">Recipe Book</li>
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
