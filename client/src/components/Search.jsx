export default function Search() {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form>
          <div className="flex items-center gap-2">
            <label className="font-semibold whitespace-nowrap">Search: </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
            ></input>
          </div>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Order: </label>
            <select id="sort_order" className="border rounded-lg p-3">
              <option>Latest</option>
              <option>CALORIES: High to Low</option>
              <option>CALORIES: Low to High</option>
              <option>PROTIEN: High to Low</option>
              <option>PROTIEN: Low to High</option>
              <option>CARBS: High to Low</option>
              <option>CARBS: Low to High</option>
              <option>FAT: High to Low</option>
              <option>FAT: Low to High</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90">
            Search
          </button>
        </form>
      </div>
      <div className="">
        <h1 className="text-3xl font-semibold p-3 border-b mt-5 text-slate-800">
          Results:
        </h1>
      </div>
    </div>
  );
}
