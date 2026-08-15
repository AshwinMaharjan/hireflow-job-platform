import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import {
  Plus,
  MapPin,
  Users,
  CalendarClock,
  Pencil,
  Trash2,
  Eye,
  AlertTriangle,
  RefreshCw,
  Briefcase,
  ChevronDown,
  Loader2,
  X,
} from "lucide-react";
import Footer from "../components/home/Footer";

const STATUS_STYLES = {
  Draft: "bg-gray-100 text-gray-600",
  Published: "bg-green-100 text-green-700",
  Closed: "bg-red-100 text-red-600",
};

const STATUS_OPTIONS = ["Draft", "Published", "Closed"];
const FILTERS = ["All", "Draft", "Published", "Closed"];

function authHeaders() {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
}



function RecruiterJobCard({ job, onStatusChange, onDelete, updatingStatus }) {
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);

  const deadlineText = job.deadline
    ? new Date(job.deadline).toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  const salaryText =
    job.salary && job.salary > 0
      ? `${Number(job.salary).toLocaleString("en-IN")}/mo`
      : "Not disclosed";

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-lg font-bold text-gray-900">{job.title}</h2>
          <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
            <MapPin size={14} />
            {job.location}
          </div>
        </div>

        {/* Status dropdown */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setStatusMenuOpen((v) => !v)}
            disabled={updatingStatus}
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition disabled:opacity-60 ${
              STATUS_STYLES[job.status] || STATUS_STYLES.Draft
            }`}
          >
            {updatingStatus ? <Loader2 size={12} className="animate-spin" /> : null}
            {job.status}
            <ChevronDown size={12} />
          </button>

          {statusMenuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setStatusMenuOpen(false)} />
              <div className="absolute right-0 z-20 mt-1.5 w-36 rounded-lg border border-gray-100 bg-white py-1 shadow-lg">
                {STATUS_OPTIONS.map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusMenuOpen(false);
                      if (status !== job.status) onStatusChange(job._id, status);
                    }}
                    className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                      status === job.status ? "font-semibold text-primary-600" : "text-gray-600"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
        <span className="inline-flex items-center gap-1.5">
          Rs. {salaryText}
        </span>

        {deadlineText && (
          <span className="inline-flex items-center gap-1.5">
            <CalendarClock size={14} className="text-primary-600" />
            Deadline {deadlineText}
          </span>
        )}

        <span className="inline-flex items-center gap-1.5">
          <Users size={14} className="text-primary-600" />
          {job.applicantCount ?? 0} applicant{(job.applicantCount ?? 0) === 1 ? "" : "s"}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 border-t pt-4">
        <Link
          to={`/jobs/${job._id}`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3.5 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
        >
          <Eye size={15} />
          View
        </Link>

        <Link
          to={`/recruiter/jobs/${job._id}/edit`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3.5 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
        >
          <Pencil size={15} />
          Edit
        </Link>

        <Link
          to={`/recruiter/jobs/${job._id}/applicants`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3.5 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
        >
          <Users size={15} />
          Applicants
        </Link>

        <button
          onClick={() => onDelete(job)}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50"
        >
          <Trash2 size={15} />
          Delete
        </button>
      </div>
    </div>
  );
}

function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [updatingId, setUpdatingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      setError("");


      
      const res = await api.get("/jobs/my-jobs", authHeaders());
      setJobs(res.data);
    } catch (err) {
      console.error(err);
      setError("We couldn't load your job postings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const counts = useMemo(() => {
    const base = { All: jobs.length, Draft: 0, Published: 0, Closed: 0 };
    jobs.forEach((j) => {
      if (base[j.status] !== undefined) base[j.status] += 1;
    });
    return base;
  }, [jobs]);

  const visibleJobs = useMemo(() => {
    if (filter === "All") return jobs;
    return jobs.filter((j) => j.status === filter);
  }, [jobs, filter]);

  const handleStatusChange = async (jobId, status) => {
    const previous = jobs;
    setUpdatingId(jobId);
    setJobs((prev) => prev.map((j) => (j._id === jobId ? { ...j, status } : j)));

    try {
      await api.patch(`/jobs/${jobId}/status`, { status }, authHeaders());
    } catch (err) {
      console.error(err);
      setJobs(previous); // roll back
      setError("Couldn't update job status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      await api.delete(`/jobs/${deleteTarget._id}`, authHeaders());
      setJobs((prev) => prev.filter((j) => j._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      setError("Couldn't delete this job. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl animate-pulse px-6 py-10">
        <div className="mb-8 h-8 w-56 rounded bg-gray-200" />
        <div className="grid gap-5 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-48 rounded-2xl border border-gray-100 bg-white p-6">
              <div className="h-5 w-2/3 rounded bg-gray-200" />
              <div className="mt-3 h-3.5 w-1/3 rounded bg-gray-200" />
              <div className="mt-6 h-3.5 w-full rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Job Postings</h1>
          <p className="mt-1 text-sm text-gray-500">
            {jobs.length === 0
              ? "You haven't posted any jobs yet"
              : `${jobs.length} job${jobs.length > 1 ? "s" : ""} posted`}
          </p>
        </div>

        
      </div>

      {error && (
        <div className="mb-5 flex items-center justify-between gap-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
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

      {/* Filter tabs */}
      {jobs.length > 0 && (
        <div className="mb-6 flex gap-1 overflow-x-auto rounded-lg bg-gray-100 p-1 text-sm">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`whitespace-nowrap rounded-md px-3.5 py-1.5 font-medium transition ${
                filter === f ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {f}
              <span className="ml-1.5 text-xs text-gray-400">{counts[f]}</span>
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-20 text-center">
          <Briefcase className="mb-4 text-gray-300" size={36} />
          <p className="font-semibold text-gray-800">No job postings yet</p>
          <p className="mt-1 max-w-sm text-sm text-gray-500">
            Create your first job listing and start receiving applications from candidates.
          </p>
          <Link
            to="/recruiter/jobs/new"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            <Plus size={16} />
            Post Your First Job
          </Link>
        </div>
      ) : visibleJobs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center text-sm text-gray-500">
          No jobs with status "{filter}".
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {visibleJobs.map((job) => (
            <RecruiterJobCard
              key={job._id}
              job={job}
              onStatusChange={handleStatusChange}
              onDelete={setDeleteTarget}
              updatingStatus={updatingId === job._id}
            />
          ))}
        </div>
      )}

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

            <h3 className="mt-4 font-bold text-gray-900">Delete this job posting?</h3>
            <p className="mt-1.5 text-sm text-gray-500">
              "{deleteTarget.title}" will be permanently removed, along with its listing. This
              can't be undone.
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
                {deleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                Delete
              </button>
            </div>
          </div>
        </div>
    )}
    </div>
    <Footer />
    </>
  );
}

export default MyJobs;