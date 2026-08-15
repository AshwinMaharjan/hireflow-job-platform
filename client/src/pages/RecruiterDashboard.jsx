import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  Search,
  MapPin,
  Briefcase,
  X,
  IndianRupee,
  CalendarClock,
  RefreshCw,
  Filter,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  FileEdit,
  Rocket,
  XCircle,
  RotateCcw,
  Plus,
  Users,
  Pencil,
  Trash2,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import Footer from "../components/home/Footer";

const EMPLOYMENT_TYPES = [
  "Full-Time",
  "Part-Time",
  "Internship",
  "Contract",
  "Remote",
];

function authHeaders() {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
}

function RecruiterDashboard() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm, setLocationTerm] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("Newest");

  // Accordion sections
  const [openSections, setOpenSections] = useState({
    Draft: true,
    Published: true,
    Closed: true,
  });


  
  const [statusUpdating, setStatusUpdating] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchMyJobs();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/jobs/my-jobs", authHeaders());
      setJobs(res.data || []);
    } catch (err) {
      console.error(err);
      setError("We couldn't load your job postings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const refreshJobs = () => {
    fetchMyJobs();
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


  

  const handleStatusChange = async (jobId, newStatus) => {
    const previous = jobs;
    setStatusUpdating(jobId);
    setJobs((prev) =>
      prev.map((j) => (j._id === jobId ? { ...j, status: newStatus } : j)),
    );

    try {
      const res = await api.patch(
        `/jobs/${jobId}/status`,
        { status: newStatus },
        authHeaders(),
      );
      setJobs((prev) =>
        prev.map((job) =>
          job._id === jobId ? { ...job, status: res.data.job.status } : job,
        ),
      );
      setToast(`Job marked as ${newStatus}`);
    } catch (err) {
      console.error(err);
      setJobs(previous); // roll back
      setToast("Couldn't update job status. Try again.");
    } finally {
      setStatusUpdating(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      await api.delete(`/jobs/${deleteTarget._id}`, authHeaders());
      setJobs((prev) => prev.filter((job) => job._id !== deleteTarget._id));
      setDeleteTarget(null);
      setToast("Job deleted");
    } catch (err) {
      console.error(err);
      setToast("Couldn't delete this job. Try again.");
    } finally {
      setDeleting(false);
    }
  };


  

  const filteredJobs = useMemo(() => {
    let data = [...jobs];

    data = data.filter((job) => {
      const matchesSearch = job.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesLocation = job.location
        ?.toLowerCase()
        .includes(locationTerm.toLowerCase());

      const matchesEmployment = employmentType
        ? job.employmentType === employmentType
        : true;

      const matchesStatus = statusFilter ? job.status === statusFilter : true;

      return (
        matchesSearch && matchesLocation && matchesEmployment && matchesStatus
      );
    });

    switch (sortBy) {
      case "Oldest":
        data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;

      case "Job Title":
        data.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        break;

      case "Deadline":
        data.sort((a, b) => {
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline) - new Date(b.deadline);
        });
        break;

      default:
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return data;
  }, [jobs, searchTerm, locationTerm, employmentType, statusFilter, sortBy]);


  

  const stats = useMemo(() => {
    return {
      total: jobs.length,
      draft: jobs.filter((j) => j.status === "Draft").length,
      published: jobs.filter((j) => j.status === "Published").length,
      closed: jobs.filter((j) => j.status === "Closed").length,
    };
  }, [jobs]);


  

  const groupedJobs = {
    Draft: filteredJobs.filter((j) => j.status === "Draft"),
    Published: filteredJobs.filter((j) => j.status === "Published"),
    Closed: filteredJobs.filter((j) => j.status === "Closed"),
  };

  const statusConfig = {
    Draft: {
      icon: FileEdit,
      color: "text-gray-600",
      bg: "bg-gray-50",
      border: "border-gray-200",
    },
    Published: {
      icon: Rocket,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
    },
    Closed: {
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
    },
  };

  const formatSalary = (job) =>
    job.salary && job.salary > 0
      ? `₹${Number(job.salary).toLocaleString("en-IN")}/mo`
      : "Not disclosed";

  const formatDeadline = (job) =>
    job.deadline
      ? new Date(job.deadline).toLocaleDateString(undefined, {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : null;

  return (
    <>
      <div className="max-w-7xl mx-auto px-5 py-8">
        {/* Toast */}
        {toast && (
          <div className="fixed right-6 top-6 z-50 rounded-lg bg-gray-900/90 px-4 py-2.5 text-sm font-medium text-white shadow-lg">
            {toast}
          </div>
        )}

      

        {/* Error banner */}
        {error && (
          <div className="mb-6 flex items-center justify-between gap-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            <span className="flex items-center gap-2">
              <AlertTriangle size={16} className="shrink-0" />
              {error}
            </span>
            <button
              onClick={fetchMyJobs}
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-red-600 shadow-sm transition hover:bg-red-100"
            >
              <RefreshCw size={12} />
              Retry
            </button>
          </div>
        )}



        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
  <div className="rounded-2xl border bg-blue-50 p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
    <div className="flex justify-between items-center">
      <Briefcase className="text-blue-600" />
      <span className="text-3xl font-bold text-blue-700">{stats.total}</span>
    </div>
    <p className="mt-4 text-blue-700 text-sm">Total Jobs</p>
  </div>

  <div className="rounded-2xl border bg-amber-50 p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
    <div className="flex justify-between">
      <FileEdit className="text-amber-600" />
      <span className="text-3xl font-bold text-amber-700">
        {stats.draft}
      </span>
    </div>
    <p className="mt-4 text-amber-700 text-sm">Draft</p>
  </div>

  <div className="rounded-2xl border bg-green-50 p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
    <div className="flex justify-between">
      <Rocket className="text-green-600" />
      <span className="text-3xl font-bold text-green-700">
        {stats.published}
      </span>
    </div>
    <p className="mt-4 text-green-700 text-sm">Published</p>
  </div>

  <div className="rounded-2xl border bg-red-50 p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
    <div className="flex justify-between">
      <XCircle className="text-red-600" />
      <span className="text-3xl font-bold text-red-700">
        {stats.closed}
      </span>
    </div>
    <p className="mt-4 text-red-700 text-sm">Closed</p>
  </div>
</div>



        <div className="rounded-3xl border bg-white p-6 shadow-sm mb-10">
          <div className="flex items-center gap-2 mb-5">
            <Filter size={18} className="text-primary-600" />
            <h2 className="font-semibold text-lg">Filter Jobs</h2>
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
                {EMPLOYMENT_TYPES.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none"
            >
              <option value="">All Status</option>
              <option>Draft</option>
              <option>Published</option>
              <option>Closed</option>
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
                  <option>Job Title</option>
                  <option>Deadline</option>
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
                {filteredJobs.length}
              </span>{" "}
              job{filteredJobs.length !== 1 && "s"}
            </p>
            <button
              onClick={refreshJobs}
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 transition"
            >
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>
        </div>


        {loading ? (
          <div className="rounded-3xl bg-white border shadow-sm py-24 flex flex-col items-center justify-center">
            <RefreshCw
              size={42}
              className="animate-spin text-primary-600 mb-5"
            />
            <h3 className="text-xl font-semibold">Loading Your Jobs...</h3>
            <p className="text-gray-500 mt-2">
              Please wait while we fetch your job postings.
            </p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed bg-white py-24 text-center">
            <Briefcase size={64} className="mx-auto text-gray-300 mb-5" />
            <h2 className="text-3xl font-bold text-gray-800">
              No Job Postings Yet
            </h2>
            <p className="text-gray-500 mt-3 max-w-md mx-auto">
              Create your first job listing and start receiving applications
              from candidates.
            </p>
            <button
              onClick={() => navigate("/recruiter/jobs/new")}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-white hover:bg-primary-700 transition"
            >
              <Plus size={16} />
              Post Your First Job
            </button>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed bg-white py-24 text-center">
            <Search size={64} className="mx-auto text-gray-300 mb-5" />
            <h2 className="text-3xl font-bold">No Matching Jobs</h2>
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
            {Object.entries(groupedJobs).map(([status, statusJobs]) => {
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
                          {statusJobs.length} job
                          {statusJobs.length !== 1 && "s"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span
                        className={`rounded-full px-4 py-1 text-sm font-semibold bg-white ${config.color}`}
                      >
                        {statusJobs.length}
                      </span>
                      {openSections[status] ? <ChevronUp /> : <ChevronDown />}
                    </div>
                  </button>

                  {/* Cards */}
                  {openSections[status] && (
                    <div className="p-6">
                      {statusJobs.length === 0 ? (
                        <div className="rounded-2xl border-2 border-dashed py-14 text-center">
                          <Icon
                            size={48}
                            className={`mx-auto mb-4 ${config.color}`}
                          />
                          <h3 className="text-xl font-semibold">
                            No {status} Jobs
                          </h3>
                          <p className="text-gray-500 mt-2">
                            Jobs with this status will appear here.
                          </p>
                        </div>
                      ) : (
                        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                          {statusJobs.map((job) => {
                            const isUpdating = statusUpdating === job._id;

                            return (
                              <div
                                key={job._id}
                                className="rounded-2xl border border-gray-100 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                              >
                                <h3 className="text-lg font-bold text-gray-900">
                                  {job.title}
                                </h3>
                                <p className="mt-0.5 text-sm text-gray-500">
                                  {job.company}
                                </p>

                                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-gray-500">
                                  {job.location && (
                                    <span className="inline-flex items-center gap-1.5">
                                      <MapPin
                                        size={14}
                                        className="text-primary-600"
                                      />
                                      {job.location}
                                    </span>
                                  )}
                                  <span className="inline-flex items-center gap-1.5">
                                    <IndianRupee
                                      size={14}
                                      className="text-primary-600"
                                    />
                                    {formatSalary(job)}
                                  </span>
                                  {formatDeadline(job) && (
                                    <span className="inline-flex items-center gap-1.5">
                                      <CalendarClock
                                        size={14}
                                        className="text-primary-600"
                                      />
                                      Deadline {formatDeadline(job)}
                                    </span>
                                  )}
                                </div>

                                <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-4">
                                  {job.status === "Draft" && (
                                    <button
                                      onClick={() =>
                                        handleStatusChange(
                                          job._id,
                                          "Published",
                                        )
                                      }
                                      disabled={isUpdating}
                                      className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
                                    >
                                      {isUpdating ? (
                                        <Loader2
                                          size={14}
                                          className="animate-spin"
                                        />
                                      ) : (
                                        <Rocket size={14} />
                                      )}
                                      Publish
                                    </button>
                                  )}

                                  {job.status === "Published" && (
                                    <button
                                      onClick={() =>
                                        handleStatusChange(job._id, "Closed")
                                      }
                                      disabled={isUpdating}
                                      className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                                    >
                                      {isUpdating ? (
                                        <Loader2
                                          size={14}
                                          className="animate-spin"
                                        />
                                      ) : (
                                        <XCircle size={14} />
                                      )}
                                      Close
                                    </button>
                                  )}

                                  {job.status === "Closed" && (
                                    <button
                                      onClick={() =>
                                        handleStatusChange(
                                          job._id,
                                          "Published",
                                        )
                                      }
                                      disabled={isUpdating}
                                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 px-3.5 py-2 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:from-blue-600 hover:to-blue-800 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                      {isUpdating ? (
                                        <Loader2
                                          size={15}
                                          className="animate-spin"
                                        />
                                      ) : (
                                        <RotateCcw size={15} />
                                      )}
                                      Reopen
                                    </button>
                                  )}

                                  <button
                                    onClick={() =>
                                      navigate(
                                        `/recruiter/jobs/${job._id}/applicants`,
                                      )
                                    }
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                                  >
                                    <Users size={15} />
                                    Applicants
                                  </button>

                                  <button
                                    onClick={() =>
                                      navigate(`/recruiter/jobs/${job._id}/edit`)
                                    }
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                                  >
                                    <Pencil size={15} />
                                    Edit
                                  </button>

                                  <button
                                    onClick={() => setDeleteTarget(job)}
                                    className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50"
                                  >
                                    <Trash2 size={15} />
                                    Delete
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                <Trash2 size={18} />
              </div>
              <button
                onClick={() => setDeleteTarget(null)}
                className="text-gray-400 transition hover:text-gray-600"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <h3 className="mt-4 font-bold text-gray-900">
              Delete this job posting?
            </h3>
            <p className="mt-1.5 text-sm text-gray-500">
              "{deleteTarget.title}" will be permanently removed. This can't
              be undone.
            </p>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Trash2 size={15} />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default RecruiterDashboard;