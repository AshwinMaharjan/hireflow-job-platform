import { useEffect, useState } from "react";
import api from "../services/api";
import ApplicationCard from "../components/ApplicationCard";
import { Search, MapPin } from "lucide-react";

function CandidateDashboard() {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm, setLocationTerm] = useState("");
  const [employmentType, setEmploymentType] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/applications/my-applications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setApplications(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  const filteredApplications = applications.filter((application) => {
    const job = application.job;
    if (!job) return false;

    const matchesSearch = job.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesLocation = job.location
      ?.toLowerCase()
      .includes(locationTerm.toLowerCase());

    const matchesEmploymentType = employmentType
      ? job.employmentType === employmentType
      : true;

    return matchesSearch && matchesLocation && matchesEmploymentType;
  });

  const hasActiveFilters = searchTerm || locationTerm || employmentType;

  const clearFilters = () => {
    setSearchTerm("");
    setLocationTerm("");
    setEmploymentType("");
  };

  return (
    <div className="max-w-6xl mx-auto p-6">

      <h1 className="text-4xl font-bold mb-6">
        My Applications
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
            placeholder="Search by job title..."
            className="border rounded-lg pl-10 pr-4 py-2 w-full"
          />
        </div>

        {/* <div className="relative flex-1">
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
        </div> */}

        {/* <select
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
        </select> */}

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 underline whitespace-nowrap px-2"
          >
            Clear filters
          </button>
        )}

      </div>

      {applications.length === 0 ? (
        <p>You haven't applied to any jobs yet.</p>
      ) : filteredApplications.length === 0 ? (
        <p>No applications found matching your filters.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">

          {filteredApplications.map((application) => (
            <ApplicationCard
              key={application._id}
              application={application}
            />
          ))}

        </div>
      )}

    </div>
  );
}

export default CandidateDashboard;