import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MealCard from "./MealCard";
import { apiFetch } from "../utils/api";

const MEAL_TAG_OPTIONS = [
  "breakfast",
  "lunch",
  "dinner",
  "snack",
  "vegetarian",
];

export default function Search() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    searchTerm: "",
    sort: "latest",
    order: "desc",
    mealTags: [],
  });
  const [loading, setLoading] = useState(false);
  const [meals, setMeals] = useState(false);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");
    const mealTagsFromUrl = (urlParams.get("mealTags") || "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (searchTermFromUrl || sortFromUrl || orderFromUrl || mealTagsFromUrl.length) {
      setSearchData({
        searchTerm: searchTermFromUrl || "",
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
        mealTags: mealTagsFromUrl,
      });
    }
    const fetchListings = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const endpoint = currentUser
        ? `/api/meal/search?${searchQuery}${
            searchQuery ? "&" : ""
          }includePublic=true`
        : `/api/meal/public/search?${searchQuery}`;
      const res = await apiFetch(endpoint);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      }
      setMeals(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search, currentUser]);

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSearchData({ ...searchData, searchTerm: e.target.value });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "latest";
      const order = e.target.value.split("_")[1] || "desc";

      setSearchData({ ...searchData, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    console.log(urlParams);
    urlParams.set("searchTerm", searchData.searchTerm);
    urlParams.set("sort", searchData.sort);
    urlParams.set("order", searchData.order);
    if (searchData.mealTags.length > 0) {
      urlParams.set("mealTags", searchData.mealTags.join(","));
    }
    const searchQuery = urlParams.toString();

    navigate(`/search?${searchQuery}`);
  };

  const handleMealTagToggle = (tag) => {
    setSearchData((prev) => ({
      ...prev,
      mealTags: prev.mealTags.includes(tag)
        ? prev.mealTags.filter((item) => item !== tag)
        : [...prev.mealTags, tag],
    }));
  };

  const onShowMoreClick = async () => {
    const numberOfMeals = meals.length;
    const startIndex = numberOfMeals;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const endpoint = currentUser
      ? `/api/meal/search?${searchQuery}&includePublic=true`
      : `/api/meal/public/search?${searchQuery}`;
    const res = await apiFetch(endpoint);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setMeals([...meals, ...data]);
  };

  return (
    <div className="flex flex-col w-fit">
      <div className="p-7 border-b-2 border-r-2">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label className="font-semibold whitespace-nowrap">Search: </label>
            <input
              value={searchData.searchTerm}
              onChange={handleChange}
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-fit"
            ></input>
          </div>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Order: </label>
            <select
              onChange={handleChange}
              defaultValue={"created_at_desc"}
              id="sort_order"
              className="border rounded-lg p-3"
            >
              <option value="latest_desc">Latest</option>
              <option value="latest_asc">Oldest</option>
              <option value="calories_desc">CALORIES: High to Low</option>
              <option value="calories_asc">CALORIES: Low to High</option>
              <option value="prots_desc">PROTEIN: High to Low</option>
              <option value="prots_asc">PROTEIN: Low to High</option>
              <option value="carbs_desc">CARBOHYDRATES: High to Low</option>
              <option value="carbs_asc">CARBOHYDRATES: Low to High</option>
              <option value="fats_desc">FATS: High to Low</option>
              <option value="fats_asc">FATS: Low to High</option>
            </select>
          </div>
          <div className="mt-2">
            <p className="font-semibold mb-1">Meal Type:</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {MEAL_TAG_OPTIONS.map((tag) => (
                <label key={tag} className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={searchData.mealTags.includes(tag)}
                    onChange={() => handleMealTagToggle(tag)}
                  />
                  <span className="capitalize">{tag}</span>
                </label>
              ))}
            </div>
          </div>
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90">
            Search
          </button>
        </form>
      </div>
      <div className="border-r-2">
        <h1 className="text-3xl font-semibold p-3 border-b mt-5 text-slate-800">
          Results:
        </h1>
        {!loading &&
          meals &&
          meals.map((meal, index) => (
            <MealCard key={meal._id} meal={meal} index={index} />
          ))}
        {loading && "Loading Results"}
        {showMore && (
          <button
            onClick={onShowMoreClick}
            className="text-green-700 hover:underline p-7 text-center w-full"
          >
            Show More Results
          </button>
        )}
        {!loading && !meals && "No meals found"}
      </div>
    </div>
  );
}
