import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  FileText,
  Mail,
  Calendar,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  RefreshCw,
  Inbox,
  X,
  Search,
  ArrowUpDown,
} from "lucide-react";

const API_BASE = "http://localhost:5000/api";


const statusBadge = {
  Pending: "border-amber-200 bg-amber-50 text-amber-700",
  Reviewed: "border-blue-200 bg-blue-50 text-blue-700",
  Accepted: "border-green-200 bg-green-50 text-green-700",
  Rejected: "border-red-200 bg-red-50 text-red-700",
};

const statusDot = {
  Pending: "bg-amber-500",
  Reviewed: "bg-blue-500",
  Accepted: "bg-green-500",
  Rejected: "bg-red-500",
};

const STATUS_FILTERS = ["All", "Pending", "Reviewed", "Accepted", "Rejected"];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "name", label: "Name (A-Z)" },
];

function getInitials(name = "") {
  return (
    name
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?"
  );
}

function StatusBadge({ status }) {
  const classes = statusBadge[status] || statusBadge.Pending;
  const dot = statusDot[status] || statusDot.Pending;
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${classes}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
}

function Spinner({ className = "h-3.5 w-3.5" }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border border-neutral-200 bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-full bg-neutral-200" />
          <div>
            <div className="h-4 w-40 rounded bg-neutral-200" />
            <div className="mt-2 h-3 w-32 rounded bg-neutral-100" />
            <div className="mt-2 h-3 w-24 rounded bg-neutral-100" />
          </div>
        </div>
        <div className="h-5 w-16 rounded-full bg-neutral-200" />
      </div>
      <div className="mt-5 flex gap-2">
        <div className="h-8 w-24 rounded-lg bg-neutral-100" />
        <div className="h-8 w-24 rounded-lg bg-neutral-100" />
        <div className="h-8 w-20 rounded-lg bg-neutral-100" />
      </div>
    </div>
  );
}

function Toast({ toast, onDismiss }) {
  if (!toast) return null;
  const isError = toast.type === "error";
  return (
    <div
      role="status"
      className="fixed right-4 top-4 z-[60] flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-4 shadow-lg"
    >
      {isError ? (
        <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
      ) : (
        <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
      )}
      <p className="text-sm font-medium text-neutral-800">{toast.message}</p>
      <button
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="ml-1 rounded-lg p-1 text-neutral-400 transition duration-150 ease-out hover:bg-neutral-100 hover:text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function RejectConfirmModal({ target, onCancel, onConfirm, isSubmitting }) {
  if (!target) return null;
  const isBulk = Boolean(target.bulk);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reject-modal-title"
    >
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <h3
            id="reject-modal-title"
            className="font-heading text-lg font-semibold text-neutral-900"
          >
            {isBulk
              ? `Reject ${target.count} candidates?`
              : "Reject candidate?"}
          </h3>
          <button
            onClick={onCancel}
            aria-label="Close"
            className="rounded-lg p-1 text-neutral-400 transition duration-150 ease-out hover:bg-neutral-100 hover:text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-2 text-sm text-neutral-600">
          {isBulk ? (
            <>
              This moves{" "}
              <span className="font-medium text-neutral-800">
                {target.count} selected applicants
              </span>{" "}
              to Rejected and notifies each of them by email.
            </>
          ) : (
            <>
              This moves{" "}
              <span className="font-medium text-neutral-800">
                {target.candidate?.name}
              </span>{" "}
              to Rejected and notifies them by email.
            </>
          )}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 shadow-sm transition duration-150 ease-out hover:border-neutral-400 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-150 ease-out hover:bg-red-700 active:bg-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting && <Spinner className="h-4 w-4" />}
            {isBulk ? `Reject ${target.count}` : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
}

const ApplicantsPage = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(null); // { id, status }
  const [bulkUpdating, setBulkUpdating] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [toast, setToast] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const toastTimerRef = useRef(null);

  // Search / filter / sort
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  // Multi-select for bulk actions
  const [selectedIds, setSelectedIds] = useState(new Set());

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 4000);
  }, []);

  useEffect(
    () => () => toastTimerRef.current && clearTimeout(toastTimerRef.current),
    [],
  );

  const fetchApplicants = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/applications/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data);
    } catch (err) {
      console.error(err);
      setError(
        "Failed to load applicants. Check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  const updateStatus = async (appId, status) => {
    setUpdating({ id: appId, status });
    const previous = applications;
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API_BASE}/applications/${appId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setApplications((prev) =>
        prev.map((app) => (app._id === appId ? { ...app, status } : app)),
      );
      const name =
        previous.find((a) => a._id === appId)?.candidate?.name || "Candidate";
      showToast(`${name} moved to ${status}`, "success");
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(appId);
        return next;
      });
    } catch (err) {
      console.error(err);
      showToast(
        "Couldn't update application status. Please try again.",
        "error",
      );
    } finally {
      setUpdating(null);
      setRejectTarget(null);
    }
  };

  const bulkUpdateStatus = async (ids, status) => {
    setBulkUpdating(true);
    try {
      const token = localStorage.getItem("token");
      await Promise.all(
        ids.map((id) =>
          axios.patch(
            `${API_BASE}/applications/${id}/status`,
            { status },
            { headers: { Authorization: `Bearer ${token}` } },
          ),
        ),
      );
      setApplications((prev) =>
        prev.map((app) => (ids.includes(app._id) ? { ...app, status } : app)),
      );
      showToast(
        `${ids.length} applicant${ids.length > 1 ? "s" : ""} moved to ${status}`,
        "success",
      );
      setSelectedIds(new Set());
    } catch (err) {
      console.error(err);
      showToast(
        "Couldn't update some applications. Please try again.",
        "error",
      );
    } finally {
      setBulkUpdating(false);
      setRejectTarget(null);
    }
  };

  const toggleExpand = (appId) => {
    setExpandedId((prev) => (prev === appId ? null : appId));
  };

  const toggleSelect = (appId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(appId)) next.delete(appId);
      else next.add(appId);
      return next;
    });
  };

  const statusCounts = useMemo(() => {
    const counts = { All: applications.length };
    for (const s of ["Pending", "Reviewed", "Accepted", "Rejected"]) {
      counts[s] = applications.filter((a) => a.status === s).length;
    }
    return counts;
  }, [applications]);

  const filteredApplications = useMemo(() => {
    let list = applications;

    if (statusFilter !== "All") {
      list = list.filter((a) => a.status === statusFilter);
    }

    const q = searchTerm.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (a) =>
          (a.candidate?.name || "").toLowerCase().includes(q) ||
          (a.candidate?.email || "").toLowerCase().includes(q),
      );
    }

    return [...list].sort((a, b) => {
      if (sortBy === "name") {
        return (a.candidate?.name || "").localeCompare(b.candidate?.name || "");
      }
      const dateA = new Date(a.createdAt).getTime() || 0;
      const dateB = new Date(b.createdAt).getTime() || 0;
      return sortBy === "oldest" ? dateA - dateB : dateB - dateA;
    });
  }, [applications, statusFilter, searchTerm, sortBy]);

  const visibleIds = filteredApplications.map((a) => a._id);
  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedIds.has(id));
  const selectedCount = selectedIds.size;

  const toggleSelectAllVisible = () => {
    setSelectedIds((prev) => {
      if (allVisibleSelected) {
        const next = new Set(prev);
        visibleIds.forEach((id) => next.delete(id));
        return next;
      }
      return new Set([...prev, ...visibleIds]);
    });
  };

  const jobTitle = applications[0]?.job?.title;

  return (
    <div className="min-h-screen bg-neutral-50">
      <Toast toast={toast} onDismiss={() => setToast(null)} />
      <RejectConfirmModal
        target={rejectTarget}
        isSubmitting={
          rejectTarget?.bulk ? bulkUpdating : updating?.id === rejectTarget?._id
        }
        onCancel={() => setRejectTarget(null)}
        onConfirm={() =>
          rejectTarget?.bulk
            ? bulkUpdateStatus(rejectTarget.ids, "Rejected")
            : updateStatus(rejectTarget._id, "Rejected")
        }
      />

      <div className="mx-auto grid max-w-3xl gap-4 p-6">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-neutral-900">
          Applicants{jobTitle ? ` for ${jobTitle}` : ""}
        </h1>

        {!loading && !error && applications.length > 0 && (
          <div className="grid gap-3">
            {/* Search + sort */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full rounded-lg border border-neutral-300 bg-white py-2 pl-9 pr-9 text-sm text-neutral-800 shadow-sm transition duration-150 ease-out placeholder:text-neutral-400 focus:border-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-neutral-400 hover:text-neutral-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="relative">
                <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-neutral-300 bg-white py-2 pl-9 pr-8 text-sm text-neutral-700 shadow-sm transition duration-150 ease-out focus:border-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 sm:w-auto"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status filter chips */}
            <div className="flex flex-wrap gap-2">
              {STATUS_FILTERS.map((s) => {
                const active = statusFilter === s;
                return (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
                      active
                        ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                        : "border-neutral-300 bg-white text-neutral-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                  >
                    {s}
                    <span
                      className={`rounded-full px-1.5 text-[10px] ${
                        active
                          ? "bg-white/20"
                          : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {statusCounts[s] ?? 0}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Bulk action bar */}
        {!loading && !error && filteredApplications.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-sm">
            <label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
              <input
                type="checkbox"
                checked={allVisibleSelected}
                onChange={toggleSelectAllVisible}
                className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              />
              {selectedCount > 0 ? `${selectedCount} selected` : "Select all"}
            </label>

            {selectedCount > 0 && (
              <div className="ml-auto flex flex-wrap items-center gap-2">
                <button
                  onClick={() => bulkUpdateStatus([...selectedIds], "Reviewed")}
                  disabled={bulkUpdating}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 shadow-sm transition duration-150 ease-out hover:border-neutral-400 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {bulkUpdating && <Spinner className="h-3.5 w-3.5" />}
                  Mark Reviewed
                </button>
                <button
                  onClick={() => bulkUpdateStatus([...selectedIds], "Accepted")}
                  disabled={bulkUpdating}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition duration-150 ease-out hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <CheckCircle2 size={13} />
                  Approve
                </button>
                <button
                  onClick={() =>
                    setRejectTarget({
                      bulk: true,
                      ids: [...selectedIds],
                      count: selectedIds.size,
                    })
                  }
                  disabled={bulkUpdating}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition duration-150 ease-out hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <XCircle size={13} />
                  Reject
                </button>
                <button
                  onClick={() => setSelectedIds(new Set())}
                  disabled={bulkUpdating}
                  className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
                  aria-label="Clear selection"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {loading && (
          <div
            className="grid gap-4"
            aria-busy="true"
            aria-label="Loading applicants"
          >
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {!loading && error && (
          <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-800">
                Couldn't load applicants
              </p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <button
              onClick={fetchApplicants}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 bg-white px-3 py-1.5 text-sm font-semibold text-red-700 transition duration-150 ease-out hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          </div>
        )}

        {!loading && !error && applications.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-white px-6 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
              <Inbox className="h-6 w-6 text-neutral-400" />
            </div>
            <h2 className="mt-4 font-heading text-lg font-semibold text-neutral-900">
              No applicants yet
            </h2>
            <p className="mt-1 max-w-sm text-sm text-neutral-500">
              Once candidates apply to this job, they'll show up here for you to
              review.
            </p>
          </div>
        )}

        {!loading &&
          !error &&
          applications.length > 0 &&
          filteredApplications.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-white px-6 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
                <Search className="h-6 w-6 text-neutral-400" />
              </div>
              <h2 className="mt-4 font-heading text-lg font-semibold text-neutral-900">
                No matching applicants
              </h2>
              <p className="mt-1 max-w-sm text-sm text-neutral-500">
                Try a different search term or clear the status filter.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("All");
                }}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-semibold text-neutral-700 shadow-sm transition duration-150 ease-out hover:bg-neutral-50"
              >
                Clear filters
              </button>
            </div>
          )}

        {!loading &&
          !error &&
          filteredApplications.map((app) => {
            const isExpanded = expandedId === app._id;
            const isUpdating = updating?.id === app._id;
            const isReviewing = isUpdating && updating.status === "Reviewed";
            const isAccepting = isUpdating && updating.status === "Accepted";
            const isSelected = selectedIds.has(app._id);

            return (
              <div
                key={app._id}
                className={`rounded-xl border bg-white p-6 shadow-sm transition duration-150 ease-out ${
                  isSelected
                    ? "border-primary-400 ring-1 ring-primary-100"
                    : "border-neutral-200"
                }`}
              >
                {/* Summary row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(app._id)}
                      aria-label={`Select ${app.candidate?.name || "applicant"}`}
                      className="mt-1.5 h-4 w-4 shrink-0 rounded border-neutral-300 text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                    />
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
                      {getInitials(app.candidate?.name)}
                    </div>
                    <div className="min-w-0">
                      <h2 className="truncate font-heading text-lg font-semibold text-neutral-900">
                        {app.candidate?.name || "Unnamed candidate"}
                      </h2>
                      <p className="mt-1 flex items-center gap-1 text-sm text-neutral-500">
                        <Mail size={14} className="shrink-0" />
                        <span className="truncate">
                          {app.candidate?.email || "No email on file"}
                        </span>
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-sm text-neutral-500">
                        <Calendar size={14} className="shrink-0" />
                        <span className="font-mono text-xs tabular-nums">
                          Applied{" "}
                          {app.createdAt
                            ? new Date(app.createdAt).toLocaleDateString()
                            : "date unknown"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <StatusBadge status={app.status} />
                </div>

                {/* Toggle details */}
                <button
                  onClick={() => toggleExpand(app._id)}
                  aria-expanded={isExpanded}
                  className="mt-4 inline-flex items-center gap-1 rounded-lg py-1 text-sm font-medium text-primary-600 transition duration-150 ease-out hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp size={16} /> Hide details
                    </>
                  ) : (
                    <>
                      <ChevronDown size={16} /> View candidate details
                    </>
                  )}
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="mt-4 grid gap-4 border-t border-neutral-100 pt-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        Cover letter
                      </p>
                      <p className="mt-1.5 whitespace-pre-wrap text-sm text-neutral-600">
                        {app.coverLetter && app.coverLetter.trim().length > 0
                          ? app.coverLetter
                          : "No cover letter submitted"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        CV / Resume
                      </p>
                      {app.resumeUrl ? (
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1.5 inline-flex items-center gap-1.5 rounded-lg text-sm font-medium text-primary-600 underline-offset-2 transition duration-150 ease-out hover:text-primary-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                        >
                          <FileText size={16} />
                          View / Download CV
                        </a>
                      ) : (
                        <p className="mt-1.5 text-sm text-neutral-400">
                          No CV uploaded
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    onClick={() => updateStatus(app._id, "Reviewed")}
                    disabled={isUpdating || app.status === "Reviewed"}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-semibold text-neutral-700 shadow-sm transition duration-150 ease-out hover:border-neutral-400 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-300 disabled:border-neutral-200"
                  >
                    {isReviewing && <Spinner />}
                    Mark Reviewed
                  </button>

                  <button
                    onClick={() => updateStatus(app._id, "Accepted")}
                    disabled={isUpdating || app.status === "Accepted"}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition duration-150 ease-out hover:bg-green-700 active:bg-green-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400 disabled:shadow-none"
                  >
                    {isAccepting ? <Spinner /> : <CheckCircle2 size={14} />}
                    Approve
                  </button>

                  <button
                    onClick={() => setRejectTarget(app)}
                    disabled={isUpdating || app.status === "Rejected"}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition duration-150 ease-out hover:bg-red-700 active:bg-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400 disabled:shadow-none"
                  >
                    <XCircle size={14} />
                    Reject
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ApplicantsPage;
