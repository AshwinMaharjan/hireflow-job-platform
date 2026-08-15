import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Bookmark,
  MapPin,
  BriefcaseBusiness,
  Clock3,
  Building2,
  ArrowRight,
  Loader2,
  Sparkles,
  CalendarClock,
  Ban,
  AlertTriangle,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env?.VITE_API_URL || "http://localhost:5000";


  
const EMPLOYMENT_STYLES = {
  "Full-Time": "bg-primary-100 text-primary-700",
  "Part-Time": "bg-sky-100 text-sky-700",
  Internship: "bg-amber-100 text-amber-700",
  Contract: "bg-slate-200 text-slate-700",
  Remote: "bg-purple-100 text-purple-700",
};

function JobCard({ job, isSaved = false }) {
  const [saved, setSaved] = useState(isSaved);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);


  
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleToggleSave = async () => {
    const previous = saved;
    setSaved(!saved);  
    
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API_BASE_URL}/api/users/save-job/${job._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSaved(res.data.saved);
      setToast(res.data.saved ? "Job saved" : "Removed from saved jobs");
    } catch (err) {
      console.error(err);
      setSaved(previous);  
      
      setToast("Couldn't update saved jobs. Try again.");
    } finally {
      setLoading(false);
    }
  };

  

  const companyInitial = job.company?.charAt(0)?.toUpperCase() || "C";

  
  

  const displayedSkills = useMemo(() => job.skills?.slice(0, 4) || [], [job.skills]);

  const remainingSkills = Math.max((job.skills?.length || 0) - displayedSkills.length, 0);

  
  

  const postedText = useMemo(() => {
    if (!job.createdAt) return "Recently posted";

    const created = new Date(job.createdAt);
    const seconds = Math.floor((Date.now() - created) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;

    return created.toLocaleDateString();
  }, [job.createdAt]);

  const isNewJob = useMemo(() => {
    if (!job.createdAt) return false;
    const diffDays = (Date.now() - new Date(job.createdAt).getTime()) / 86_400_000;
    return diffDays <= 7;
  }, [job.createdAt]);

 
  

  const deadlineInfo = useMemo(() => {
    if (!job.deadline) return null;

    const deadline = new Date(job.deadline);
    const diffDays = Math.ceil((deadline.getTime() - Date.now()) / 86_400_000);

    if (diffDays < 0) {
      return { label: "Deadline passed", tone: "expired", days: diffDays };
    }
    if (diffDays === 0) {
      return { label: "Closes today", tone: "urgent", days: diffDays };
    }
    if (diffDays <= 3) {
      return { label: `${diffDays} day${diffDays > 1 ? "s" : ""} left to apply`, tone: "urgent", days: diffDays };
    }
    return {
      label: `Apply by ${deadline.toLocaleDateString(undefined, { day: "numeric", month: "short" })}`,
      tone: "normal",
      days: diffDays,
    };
  }, [job.deadline]);

  const isClosed = job.status === "Closed" || (deadlineInfo && deadlineInfo.tone === "expired");


  const salaryText =
    job.salary && job.salary > 0
      ? `${Number(job.salary).toLocaleString("en-IN")}/mo`
      : "Salary not disclosed";

  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border bg-white shadow-sm transition-all duration-300 ${
        isClosed
          ? "border-gray-200 opacity-75"
          : "border-gray-200 hover:-translate-y-2 hover:border-primary-300 hover:shadow-2xl"
      }`}
    >
      

     
      {toast && (
        <div className="absolute right-4 top-4 z-10 rounded-lg bg-gray-900/90 px-3 py-1.5 text-xs font-medium text-white shadow-lg">
          {toast}
        </div>
      )}

      <div className="p-6">
    

        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-xl font-bold text-primary-600 shadow-sm">
              {companyInitial}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="truncate text-xl font-bold text-gray-900 transition group-hover:text-primary-600">
                  {job.title}
                </h2>

                {isClosed ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-600">
                    <Ban size={12} />
                    CLOSED
                  </span>
                ) : (
                  isNewJob && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                      <Sparkles size={12} />
                      NEW
                    </span>
                  )
                )}
              </div>

              <div className="mt-2 flex items-center gap-2 text-gray-500">
                <Building2 size={16} />
                <span className="truncate">{job.company}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleToggleSave}
            disabled={loading}
            aria-pressed={saved}
            aria-label={saved ? "Remove from saved jobs" : "Save this job"}
            title={saved ? "Remove Bookmark" : "Save Job"}
            className="rounded-xl p-2 transition hover:bg-primary-50 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin text-primary-600" />
            ) : (
              <Bookmark
                size={22}
                className={`transition ${
                  saved ? "fill-primary-600 text-primary-600" : "text-gray-400 hover:text-primary-600"
                }`}
              />
            )}
          </button>
        </div>

 

        {job.description && (
          <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-gray-500">
            {job.description}
          </p>
        )}

    

        <div className="mt-5 space-y-3 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={17} className="text-primary-600" />
            <span>{job.location || "Location not specified"}</span>
          </div>

          {job.experienceLevel && (
            <div className="flex items-center gap-2 text-gray-600">
              <BriefcaseBusiness size={17} className="text-primary-600" />
              <span>{job.experienceLevel}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-gray-600">
            <Clock3 size={17} className="text-primary-600" />
            <span>{postedText}</span>
          </div>

          {deadlineInfo && (
            <div
              className={`flex items-center gap-2 ${
                deadlineInfo.tone === "expired"
                  ? "text-gray-400"
                  : deadlineInfo.tone === "urgent"
                  ? "text-red-600"
                  : "text-gray-600"
              }`}
            >
              {deadlineInfo.tone === "urgent" ? (
                <AlertTriangle size={17} />
              ) : (
                <CalendarClock size={17} className={deadlineInfo.tone === "expired" ? "" : "text-primary-600"} />
              )}
              <span className="font-medium">{deadlineInfo.label}</span>
            </div>
          )}
        </div>

  

        <div className="mt-6 flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
            Rs. {salaryText}
          </span>

          <span
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              EMPLOYMENT_STYLES[job.employmentType] || "bg-primary-100 text-primary-700"
            }`}
          >
            {job.employmentType || "Full-Time"}
          </span>
        </div>




        {displayedSkills.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {displayedSkills.map((skill, index) => (
              <span
                key={index}
                className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 transition hover:bg-primary-100 hover:text-primary-700"
              >
                {skill}
              </span>
            ))}

            {remainingSkills > 0 && (
              <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-600">
                +{remainingSkills} more
              </span>
            )}
          </div>
        )}

     
     

        <div className="mt-8 flex flex-col gap-4 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-400">Status</p>
            <p className={`font-semibold ${isClosed ? "text-gray-400" : "text-primary-600"}`}>
              {isClosed ? "Applications closed" : "Open for Applications"}
            </p>
          </div>

          <Link
            to={`/jobs/${job._id}`}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition ${
              isClosed
                ? "bg-gray-400 hover:bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isClosed ? "View Job" : "View Details"}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default JobCard;