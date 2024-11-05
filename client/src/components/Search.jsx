import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MealCard from "./MealCard";

export default function Search() {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    searchTerm: "",
    sort: "latest",
    order: "desc",
  });
  const [loading, setLoading] = useState(false);
  const [meals, setMeals] = useState(false);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");
    if (searchTermFromUrl || sortFromUrl || orderFromUrl) {
      setSearchData({
        searchTerm: searchTermFromUrl || "",
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }
    const fetchListings = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/meal/search?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      }
      setMeals(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

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
    const searchQuery = urlParams.toString();

    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfMeals = meals.length;
    const startIndex = numberOfMeals;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/meal/search?${searchQuery}`);
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
              <option value="prots_desc">PROTIEN: High to Low</option>
              <option value="prots_asc">PROTIEN: Low to High</option>
              <option value="carbs_desc">CARBS: High to Low</option>
              <option value="carbs_asc">CARBS: Low to High</option>
              <option value="fats_desc">FAT: High to Low</option>
              <option value="fats_asc">FAT: Low to High</option>
            </select>
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
