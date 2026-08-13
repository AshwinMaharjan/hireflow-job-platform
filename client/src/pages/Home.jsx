import { useEffect, useState } from "react";
import api from "../services/api";
import JobCard from "../components/JobCard";
import { Search, MapPin } from "lucide-react";

function Home() {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm, setLocationTerm] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // debounce: wait 400ms after the user stops typing/changing filters
    const delayDebounce = setTimeout(() => {
      fetchJobs();
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, locationTerm, employmentType]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (locationTerm) params.location = locationTerm;
      if (employmentType) params.employmentType = employmentType;

      const res = await api.get("/jobs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      });

      setJobs(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const hasActiveFilters = searchTerm || locationTerm || employmentType;

  const clearFilters = () => {
    setSearchTerm("");
    setLocationTerm("");
    setEmploymentType("");
  };

  return (
    <div className="max-w-7xl mx-auto p-6">

      <h1 className="text-4xl font-bold mb-6">
        Latest Jobs
      </h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">

        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search jobs by title..."
            className="border rounded-lg pl-10 pr-4 py-2 w-full"
          />
        </div>

        <div className="relative flex-1">
          <MapPin
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={locationTerm}
            onChange={(e) => setLocationTerm(e.target.value)}
            placeholder="Filter by location..."
            className="border rounded-lg pl-10 pr-4 py-2 w-full"
          />
        </div>

        <select
          value={employmentType}
          onChange={(e) => setEmploymentType(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="">All Employment Types</option>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
          <option value="Remote">Remote</option>
        </select>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 underline whitespace-nowrap px-2"
          >
            Clear filters
          </button>
        )}

      </div>

      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p>
          {hasActiveFilters
            ? "No jobs found matching your filters."
            : "No jobs found."}
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
            />
          ))}

        </div>
      )}

    </div>
  );
}

export default Home;