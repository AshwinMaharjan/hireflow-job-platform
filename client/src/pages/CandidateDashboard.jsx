import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import ApplicationCard from "../components/ApplicationCard";
import {
  Search,
  MapPin,
  Briefcase,
  X,
  FileText,
  Clock3,
  CheckCircle2,
  XCircle,
  Eye,
  RefreshCw,
  Filter,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
} from "lucide-react";
import Footer from "../components/home/Footer";

function CandidateDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm, setLocationTerm] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("Newest");

  // Accordion Sections
  const [openSections, setOpenSections] = useState({
    Pending: true,
    Reviewed: true,
    Accepted: true,
    Rejected: true,
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await api.get("/applications/my-applications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setApplications(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const refreshApplications = () => {
    fetchApplications();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setLocationTerm("");
    setEmploymentType("");
    setStatusFilter("");
    setSortBy("Newest");
  };

  const hasActiveFilters =
    searchTerm ||
    locationTerm ||
    employmentType ||
    statusFilter ||
    sortBy !== "Newest";

  const toggleSection = (status) => {
    setOpenSections((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  // ===========================
  // Filtering + Sorting
  // ===========================

  const filteredApplications = useMemo(() => {
    let data = [...applications];

    data = data.filter((application) => {
      const job = application.job;

      if (!job) return false;

      const matchesSearch = job.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesLocation = job.location
        ?.toLowerCase()
        .includes(locationTerm.toLowerCase());

      const matchesEmployment = employmentType
        ? job.employmentType === employmentType
        : true;

      const matchesStatus = statusFilter
        ? application.status === statusFilter
        : true;

      return (
        matchesSearch && matchesLocation && matchesEmployment && matchesStatus
      );
    });

    switch (sortBy) {
      case "Oldest":
        data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;

      case "Company A-Z":
        data.sort((a, b) =>
          (a.job?.company || "").localeCompare(b.job?.company || ""),
        );
        break;

      case "Job Title":
        data.sort((a, b) =>
          (a.job?.title || "").localeCompare(b.job?.title || ""),
        );
        break;

      default:
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return data;
  }, [
    applications,
    searchTerm,
    locationTerm,
    employmentType,
    statusFilter,
    sortBy,
  ]);

  // ===========================
  // Statistics
  // ===========================

  const stats = useMemo(() => {
    return {
      total: applications.length,
      pending: applications.filter((a) => a.status === "Pending").length,

      reviewed: applications.filter((a) => a.status === "Reviewed").length,

      accepted: applications.filter((a) => a.status === "Accepted").length,

      rejected: applications.filter((a) => a.status === "Rejected").length,
    };
  }, [applications]);

  // ===========================
  // Group Applications
  // ===========================

  const groupedApplications = {
    Pending: filteredApplications.filter((a) => a.status === "Pending"),

    Reviewed: filteredApplications.filter((a) => a.status === "Reviewed"),

    Accepted: filteredApplications.filter((a) => a.status === "Accepted"),

    Rejected: filteredApplications.filter((a) => a.status === "Rejected"),
  };

  // ===========================
  // Status Config
  // ===========================

  const statusConfig = {
    Pending: {
      icon: Clock3,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
    },

    Reviewed: {
      icon: Eye,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
    },

    Accepted: {
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
    },

    Rejected: {
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
    },
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-5 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
  <div className="rounded-2xl border bg-purple-50 p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
    <div className="flex justify-between items-center">
      <FileText className="text-purple-600" />

      <span className="text-3xl font-bold text-purple-700">{stats.total}</span>
    </div>

    <p className="mt-4 text-purple-700 text-sm">Total Applications</p>
  </div>

  <div className="rounded-2xl border bg-yellow-50 p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
    <div className="flex justify-between">
      <Clock3 className="text-yellow-600" />

      <span className="text-3xl font-bold text-yellow-700">
        {stats.pending}
      </span>
    </div>

    <p className="mt-4 text-yellow-700 text-sm">Pending</p>
  </div>

  <div className="rounded-2xl border bg-blue-50 p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
    <div className="flex justify-between">
      <Eye className="text-blue-600" />

      <span className="text-3xl font-bold text-blue-700">
        {stats.reviewed}
      </span>
    </div>

    <p className="mt-4 text-blue-700 text-sm">Reviewed</p>
  </div>

  <div className="rounded-2xl border bg-green-50 p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
    <div className="flex justify-between">
      <CheckCircle2 className="text-green-600" />

      <span className="text-3xl font-bold text-green-700">
        {stats.accepted}
      </span>
    </div>

    <p className="mt-4 text-green-700 text-sm">Accepted</p>
  </div>

  <div className="rounded-2xl border bg-red-50 p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
    <div className="flex justify-between">
      <XCircle className="text-red-600" />

      <span className="text-3xl font-bold text-red-700">
        {stats.rejected}
      </span>
    </div>

    <p className="mt-4 text-red-700 text-sm">Rejected</p>
  </div>
</div>
      
        <div className="rounded-3xl border bg-white p-6 shadow-sm mb-10">
          <div className="flex items-center gap-2 mb-5">
            <Filter size={18} className="text-primary-600" />

            <h2 className="font-semibold text-lg">Filter Applications</h2>
          </div>

          <div className="grid xl:grid-cols-5 md:grid-cols-2 gap-4">
            {/* Search */}

            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border pl-10 pr-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none"
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
                onChange={(e) => setLocationTerm(e.target.value)}
                className="w-full rounded-xl border pl-10 pr-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>

            {/* Employment */}

            <div className="relative">
              <Briefcase
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className="w-full rounded-xl border pl-10 pr-4 py-3 appearance-none focus:ring-2 focus:ring-primary-500 outline-none"
              >
                <option value="">Employment</option>
                <option>Full-Time</option>
                <option>Part-Time</option>
                <option>Internship</option>
                <option>Contract</option>
                <option>Remote</option>
              </select>
            </div>

            {/* Status */}

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none"
            >
              <option value="">All Status</option>
              <option>Pending</option>
              <option>Reviewed</option>
              <option>Accepted</option>
              <option>Rejected</option>
            </select>

            {/* Sort */}

            <div className="flex gap-3">
              <div className="relative flex-1">
                <ArrowUpDown
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full rounded-xl border pl-10 pr-4 py-3 appearance-none focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  <option>Newest</option>
                  <option>Oldest</option>
                  <option>Company A-Z</option>
                  <option>Job Title</option>
                </select>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="rounded-xl border px-4 hover:bg-gray-100 transition"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-primary-600">
                {filteredApplications.length}
              </span>{" "}
              application
              {filteredApplications.length !== 1 && "s"}
            </p>
          </div>
        </div>
       
       
        {loading ? (
          <div className="rounded-3xl bg-white border shadow-sm py-24 flex flex-col items-center justify-center">
            <RefreshCw
              size={42}
              className="animate-spin text-primary-600 mb-5"
            />

            <h3 className="text-xl font-semibold">Loading Applications...</h3>

            <p className="text-gray-500 mt-2">
              Please wait while we fetch your latest applications.
            </p>
          </div>
        ) : applications.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed bg-white py-24 text-center">
            <FileText size={64} className="mx-auto text-gray-300 mb-5" />

            <h2 className="text-3xl font-bold text-gray-800">
              No Applications Yet
            </h2>

            <p className="text-gray-500 mt-3 max-w-md mx-auto">
              Once you apply for jobs, they'll appear here so you can track
              their progress.
            </p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed bg-white py-24 text-center">
            <Search size={64} className="mx-auto text-gray-300 mb-5" />

            <h2 className="text-3xl font-bold">No Matching Applications</h2>

            <p className="text-gray-500 mt-3">
              Try changing your filters or clear them.
            </p>

            <button
              onClick={clearFilters}
              className="mt-8 rounded-xl bg-primary-600 px-6 py-3 text-white hover:bg-primary-700 transition"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedApplications).map(([status, apps]) => {
              const config = statusConfig[status];
              const Icon = config.icon;

              return (
                <section
                  key={status}
                  className="rounded-3xl border bg-white shadow-sm overflow-hidden"
                >
                  {/* Section Header */}

                  <button
                    onClick={() => toggleSection(status)}
                    className={`w-full flex items-center justify-between px-6 py-5 ${config.bg} hover:opacity-95 transition`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`h-12 w-12 rounded-xl flex items-center justify-center bg-white shadow ${config.border}`}
                      >
                        <Icon size={22} className={config.color} />
                      </div>

                      <div className="text-left">
                        <h2 className={`font-bold text-xl ${config.color}`}>
                          {status}
                        </h2>

                        <p className="text-gray-500 text-sm">
                          {apps.length} application
                          {apps.length !== 1 && "s"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span
                        className={`rounded-full px-4 py-1 text-sm font-semibold bg-white ${config.color}`}
                      >
                        {apps.length}
                      </span>

                      {openSections[status] ? <ChevronUp /> : <ChevronDown />}
                    </div>
                  </button>

                  {/* Cards */}

                  {openSections[status] && (
                    <div className="p-6">
                      {apps.length === 0 ? (
                        <div className="rounded-2xl border-2 border-dashed py-14 text-center">
                          <Icon
                            size={48}
                            className={`mx-auto mb-4 ${config.color}`}
                          />

                          <h3 className="text-xl font-semibold">
                            No {status} Applications
                          </h3>

                          <p className="text-gray-500 mt-2">
                            Applications with this status will appear here.
                          </p>
                        </div>
                      ) : (
                        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                          {apps.map((application) => (
                            <div
                              key={application._id}
                              className="transition-all duration-300 hover:-translate-y-1 hover:shadow-xl rounded-2xl"
                            >
                              <ApplicationCard application={application} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}{" "}
      </div>
      <Footer />
    </>
  );
}

export default CandidateDashboard;
