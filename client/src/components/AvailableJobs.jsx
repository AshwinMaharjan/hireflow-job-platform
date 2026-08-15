import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import SearchBar from "../components/home/SearchBar";
import JobCard from "../components/JobCard";
import LoadingSkeleton from "../components/home/LoadingSkeleton";
import EmptyState from "../components/home/EmptyState";
import { Search } from "lucide-react";
import Footer from "./home/Footer";

function AvailableJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm, setLocationTerm] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [sortBy, setSortBy] = useState("Newest");

 
const authHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

useEffect(() => {
  fetchJobs();
}, []);

const fetchJobs = async () => {
  try {
    setLoading(true);

    const res = await api.get("/jobs", {
      headers: authHeaders(),
    });

    setJobs(res.data || []);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  const filteredJobs = useMemo(() => {
    let filtered = [...jobs];

    if (searchTerm.trim()) {
      filtered = filtered.filter((job) =>
        job.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    if (locationTerm.trim()) {
      filtered = filtered.filter((job) =>
        job.location
          ?.toLowerCase()
          .includes(locationTerm.toLowerCase())
      );
    }

    if (employmentType) {
      filtered = filtered.filter(
        (job) => job.employmentType === employmentType
      );
    }

    switch (sortBy) {
      case "Newest":
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        );
        break;

      case "Oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.createdAt) -
            new Date(b.createdAt)
        );
        break;

      case "Company":
        filtered.sort((a, b) =>
          a.company.localeCompare(b.company)
        );
        break;

      case "Job Title":
        filtered.sort((a, b) =>
          a.title.localeCompare(b.title)
        );
        break;

      default:
        break;
    }

    return filtered;
  }, [
    jobs,
    searchTerm,
    locationTerm,
    employmentType,
    sortBy,
  ]);

  const hasActiveFilters =
    searchTerm ||
    locationTerm ||
    employmentType ||
    sortBy !== "Newest";

  function clearFilters() {
    setSearchTerm("");
    setLocationTerm("");
    setEmploymentType("");
    setSortBy("Newest");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="border-b border-gray-200 bg-white">
  <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
    <div className="flex flex-col gap-6 rounded-3xl border border-gray-200 bg-gray-50 p-8 lg:flex-row lg:items-center lg:justify-between">
      
      <div>
        <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
          Available Jobs
        </span>

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900">
          Find Your Next Opportunity
        </h1>

        <p className="mt-3 max-w-2xl text-gray-600">
          Explore verified job opportunities from trusted companies.
          Search, filter, and discover the role that matches your skills
          and career goals.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-5 text-center shadow-sm">
          <p className="text-3xl font-bold text-blue-600">
            {jobs.length}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Open Jobs
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-5 text-center shadow-sm">
          <p className="text-3xl font-bold text-green-600">
            {
              [...new Set(jobs.map((job) => job.company))]
                .filter(Boolean)
                .length
            }
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Companies
          </p>
        </div>
      </div>

    </div>
  </div>
</section>

      {/* Search */}
      <div className="mt-4 mx-auto max-w-7xl px-4 lg:px-6">
        <SearchBar
          title="Search Jobs"
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          locationTerm={locationTerm}
          onLocationTermChange={setLocationTerm}
          employmentType={employmentType}
          onEmploymentTypeChange={setEmploymentType}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          hasActiveFilters={hasActiveFilters}
          onClear={clearFilters}
          resultsCount={filteredJobs.length}
          sticky={false}
        />
      </div>

      {/* Jobs */}
      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
        {loading ? (
          <LoadingSkeleton count={6} />
        ) : filteredJobs.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No jobs found"
            description="Try changing your search filters."
            actionLabel={
              hasActiveFilters ? "Clear Filters" : undefined
            }
            onAction={
              hasActiveFilters ? clearFilters : undefined
            }
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}

export default AvailableJobs;