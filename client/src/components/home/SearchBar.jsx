import { Search, MapPin, ArrowUpDown, X, Filter } from "lucide-react";

function SearchBar({
  title = "Search Jobs",
  searchTerm,
  onSearchTermChange,
  locationTerm,
  onLocationTermChange,
  employmentType,
  onEmploymentTypeChange,
  sortBy,
  onSortByChange,
  showSort = true,
  hasActiveFilters,
  onClear,
  resultsCount,
  sticky = true,
}) {
  return (
    <div
      className={`${
        sticky ? "sticky top-20 z-20" : ""
      } mt-6 mx-4 lg:mx-6 xl:mx-8 rounded-3xl border border-gray-100 bg-white/95 p-6 shadow-sm backdrop-blur`}
    >
      <div className="mb-5 flex items-center gap-2">
        <Filter size={18} className="text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>

      <div
        className={`grid gap-4 md:grid-cols-2 ${showSort ? "xl:grid-cols-5" : "xl:grid-cols-4"}`}
      >
        {/* Search */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search job title..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Location */}
        <div className="relative">
          <MapPin
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Location"
            value={locationTerm}
            onChange={(e) => onLocationTermChange(e.target.value)}
            className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Employment type */}
        <select
          value={employmentType}
          onChange={(e) => onEmploymentTypeChange(e.target.value)}
          className="rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Employment</option>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
          <option value="Remote">Remote</option>
        </select>

        {/* Sort */}
        {showSort && (
          <div className="relative">
            <ArrowUpDown
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              className="w-full appearance-none rounded-xl border border-gray-200 py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Newest</option>
              <option>Oldest</option>
              <option>Company</option>
              <option>Job Title</option>
            </select>
          </div>
        )}

        {/* Clear */}
        <div className="flex gap-3">
          {hasActiveFilters && (
            <button
              onClick={onClear}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 transition hover:bg-gray-100"
            >
              <X size={18} />
              Clear
            </button>
          )}
        </div>
      </div>

      {typeof resultsCount === "number" && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing
            <span className="mx-1 font-semibold text-blue-600">
              {resultsCount}
            </span>
            job{resultsCount !== 1 && "s"}
          </p>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
