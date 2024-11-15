// import { useState } from "react";
import placeholderimg from "../../assets/placeholder.png";
import { Link } from "react-router-dom";

export default function Home() {
  //   const [signedIn, setSignedIn] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      <div className="text-2xl h-1/5 justify-center ">
        <p className="text-center">
          Your All in One Digital Recipe Book, <br /> Meal Planner, and Macro
          Tracker
        </p>
      </div>

      <div className="flex flex-row h-3/5 my-4 mx-3">
        <div className="w-6/12 h-full rounded-lg">
          <img
            src={placeholderimg}
            alt={"image with example of recipe entry"}
            className="h-full border-4 border-azul-500 drop-shadow-lg rounded-lg"
          />{" "}
        </div>
        <div className="w-6/12 ml-5 h-100% my-auto rounded-lg">
          <p className="text-2xl font-bold text-azul-600">
            Upload and Store Your Recipes
          </p>
          <p className="text-lg  mt-4 text-azul-800">
            Consolitadate your bookmarks and old family notes into clean,
            uninterupted, ad-free pages. Or, simply link the URL and store the
            nutritional information relevant to your goals.
          </p>
          <p className="text-lg  mt-2 text-azul-800">
            Clean, easy to read and safely stored in one place. Fully searchable
            library of your favorite meals.
          </p>
          <Link to={`/create-meal`}>
            <button className="bg-leaf-300 hover:bg-leaf-400 text-azul-600 rounded-lg mt-5	p-3 font-semibold uppercase">
              Create A Meal
            </button>
          </Link>
        </div>
      </div>

      <div className="flex flex-row h-3/5 my-4 mx-3">
        <div className="w-6/12 ml-5 my-auto h-100% rounded-lg">
          <p className="text-2xl font-bold  mt-8\ text-azul-600">
            Set Nutrition Goals and Build a Plan
          </p>
          <p className="text-lg  mt-4 text-azul-800">
            Set daily nutrional targets for Calories, protiens, fat, and carb
            intake. Drag and drop meals to fit your range and build out a weekly
            meal schedule.
          </p>
          <p className="text-lg  mt-2 text-azul-800">
            Discover new meals and snacks to fit your needs.
          </p>
          <Link to={`/create-meal`}>
            <button className="bg-leaf-300 hover:bg-leaf-400 text-azul-600 rounded-lg mt-5	p-3 font-semibold uppercase">
              See A Sample
            </button>
          </Link>
        </div>
        <div className="w-6/12 h-full rounded-lg">
          <img
            src={placeholderimg}
            alt={"image with example of recipe entry"}
            className="h-full border-4 border-azul-500 drop-shadow-lg rounded-lg"
          />{" "}
        </div>
      </div>

      <div className="flex flex-row h-3/5 my-4 mx-3">
        <div className="w-6/12 h-full rounded-lg">
          <img
            src={placeholderimg}
            alt={"image with example of recipe entry"}
            className="h-full border-4 border-azul-500 drop-shadow-lg rounded-lg"
          />{" "}
        </div>
        <div className="w-6/12 ml-5 my-auto h-100% rounded-lg">
          <p className="text-2xl font-bold text-azul-600">
            Print Your Shopping List and More!
          </p>
          <p className="text-lg  mt-4 text-azul-800">
            Print out your schedule, recipes, and a condensed simple shopping
            list.
          </p>
          <p className="text-lg  mt-2 text-azul-800">
            Start your meal planning journey today!
          </p>

          {
            <Link to={`/sign-up`}>
              <button className="bg-goldenrod hover:bg-leaf-400 text-azul-600 rounded-lg mt-5	p-3 font-semibold uppercase">
                Sign Up Now
              </button>
            </Link>
          }
        </div>
      </div>
    </div>
  );
}
