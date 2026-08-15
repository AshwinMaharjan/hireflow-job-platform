import { useContext, useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import {
  ArrowLeft,
  MapPin,
  CalendarClock,
  BriefcaseBusiness,
  Building2,
  Clock3,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Ban,
  RefreshCw,
  Eye,
} from "lucide-react";
import Footer from "../components/home/Footer";

const STATUS_STYLES = {
  Pending: "bg-yellow-100 text-yellow-700",
  Reviewed: "bg-blue-100 text-blue-700",
  Accepted: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
};

const EMPLOYMENT_STYLES = {
  "Full-Time": "bg-primary-100 text-primary-700",
  "Part-Time": "bg-sky-100 text-sky-700",
  Internship: "bg-amber-100 text-amber-700",
  Contract: "bg-slate-200 text-slate-700",
  Remote: "bg-purple-100 text-purple-700",
};

function JobDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  
  const isRecruiter = user?.role === "recruiter";

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [myApplication, setMyApplication] = useState(null);
  const [checkingApplied, setCheckingApplied] = useState(!isRecruiter);

  useEffect(() => {
    fetchJob();


    
    if (!isRecruiter) {
      checkIfApplied();
    }
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      const res = await api.get(`/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setJob(res.data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.status === 404
          ? "This job no longer exists or has been removed."
          : "We couldn't load this job. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const checkIfApplied = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setCheckingApplied(false);
        return;
      }

      const res = await api.get("/applications/my-applications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const matchedApplication = res.data.find(
        (application) => application.job && application.job._id === id,
      );

      setMyApplication(matchedApplication || null);
    } catch (err) {
      console.error(err);
    } finally {
      setCheckingApplied(false);
    }
  };

  const companyInitial = job?.company?.charAt(0)?.toUpperCase() || "C";

  const deadlineInfo = useMemo(() => {
    if (!job?.deadline) return null;

    const deadline = new Date(job.deadline);
    const diffDays = Math.ceil((deadline.getTime() - Date.now()) / 86_400_000);

    if (diffDays < 0) return { label: "Deadline passed", tone: "expired" };
    if (diffDays === 0) return { label: "Closes today", tone: "urgent" };
    if (diffDays <= 3)
      return {
        label: `${diffDays} day${diffDays > 1 ? "s" : ""} left to apply`,
        tone: "urgent",
      };
    return {
      label: `Apply by ${deadline.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}`,
      tone: "normal",
    };
  }, [job?.deadline]);

  const deadlinePassed = deadlineInfo?.tone === "expired";

  const salaryText =
    job?.salary && job.salary > 0
      ? `${Number(job.salary).toLocaleString("en-IN")}/mo`
      : "Not disclosed";

  const postedText = useMemo(() => {
    if (!job?.createdAt) return null;
    const created = new Date(job.createdAt);
    const days = Math.floor((Date.now() - created) / 86_400_000);
    if (days < 1) return "Posted today";
    if (days === 1) return "Posted yesterday";
    if (days < 30) return `Posted ${days} days ago`;
    return `Posted ${created.toLocaleDateString()}`;
  }, [job?.createdAt]);


  

  if (loading) {
    return (
      <div className="mx-auto mt-10 max-w-5xl animate-pulse px-4">
        <div className="mb-6 h-4 w-32 rounded bg-gray-200" />
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-xl bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-6 w-2/3 rounded bg-gray-200" />
              <div className="h-4 w-1/3 rounded bg-gray-200" />
            </div>
          </div>
          <div className="mt-8 space-y-3">
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-5/6 rounded bg-gray-200" />
            <div className="h-4 w-3/4 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }


  

  if (error || !job) {
    return (
      <div className="mx-auto mt-10 max-w-5xl px-4">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50 px-6 py-16 text-center">
          <AlertTriangle className="mb-4 text-red-500" size={32} />
          <p className="mb-4 font-medium text-red-700">
            {error || "Something went wrong."}
          </p>
          <div className="flex gap-3">
            <button
              onClick={fetchJob}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              <RefreshCw size={16} />
              Try again
            </button>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Back to Jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-5xl px-4 py-10">
        <Link
          to="/jobs"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition hover:text-primary-600"
        >
          <ArrowLeft size={16} />
          Back to Jobs
        </Link>

        {isRecruiter && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700">
            <Eye size={16} />
            You're viewing this as a recruiter, applying isn't available on this account.
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
        
        
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
              {/* Header */}
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-2xl font-bold text-primary-600 shadow-sm">
                  {companyInitial}
                </div>

                <div className="min-w-0">
                  <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    {job.title}
                  </h1>
                  <div className="mt-1.5 flex items-center gap-2 text-gray-500">
                    <Building2 size={16} />
                    <span>{job.company}</span>
                  </div>
                </div>
              </div>

              {/* Quick facts */}
              <div className="mt-6 flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-3.5 py-1.5 text-sm font-semibold ${
                    EMPLOYMENT_STYLES[job.employmentType] ||
                    "bg-primary-100 text-primary-700"
                  }`}
                >
                  {job.employmentType || "Full-Time"}
                </span>

                {job.experienceLevel && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3.5 py-1.5 text-sm font-semibold text-gray-700">
                    <BriefcaseBusiness size={14} />
                    {job.experienceLevel}
                  </span>
                )}

                <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3.5 py-1.5 text-sm font-semibold text-gray-700">
                  <MapPin size={14} />
                  {job.location}
                </span>
              </div>

              {postedText && (
                <p className="mt-4 text-xs text-gray-400">{postedText}</p>
              )}

              {/* Description */}
              <div className="mt-8 border-t pt-6">
                <h2 className="mb-3 text-lg font-bold text-gray-900">
                  About this role
                </h2>
                <p className="whitespace-pre-line leading-relaxed text-gray-600">
                  {job.description}
                </p>
              </div>

              {/* Skills */}
              {job.skills?.length > 0 && (
                <div className="mt-8 border-t pt-6">
                  <h2 className="mb-3 text-lg font-bold text-gray-900">
                    Skills required
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-blue-100 px-3.5 py-1.5 text-sm font-medium text-blue-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          
          
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
            
            
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                  Salary
                </div>
                <p className="mt-1 text-2xl font-bold text-green-600">
                  Rs. {salaryText}
                </p>

                {deadlineInfo && (
                  <div
                    className={`mt-4 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium ${
                      deadlineInfo.tone === "expired"
                        ? "bg-gray-100 text-gray-500"
                        : deadlineInfo.tone === "urgent"
                          ? "bg-red-50 text-red-600"
                          : "bg-primary-50 text-primary-700"
                    }`}
                  >
                    {deadlineInfo.tone === "urgent" ? (
                      <AlertTriangle size={16} />
                    ) : (
                      <CalendarClock size={16} />
                    )}
                    {deadlineInfo.label}
                  </div>
                )}

                {postedText && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                    <Clock3 size={13} />
                    {postedText}
                  </div>
                )}
              </div>

           
           
              {!isRecruiter && (
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  {checkingApplied ? (
                    <div className="flex items-center justify-center gap-2 py-3 text-sm text-gray-400">
                      <Loader2 size={16} className="animate-spin" />
                      Checking application status...
                    </div>
                  ) : myApplication ? (
                    <div>
                      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                        Your application status
                      </p>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold ${
                          STATUS_STYLES[myApplication.status] ||
                          STATUS_STYLES.Pending
                        }`}
                      >
                        <CheckCircle2 size={16} />
                        {myApplication.status}
                      </span>
                    </div>
                  ) : deadlinePassed ? (
                    <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-500">
                      <Ban size={16} />
                      Application deadline has passed
                    </div>
                  ) : (
                    <Link
                      to={`/jobs/${job._id}/apply`}
                      className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3.5 text-base font-semibold text-white shadow-md transition-all duration-300 hover:bg-blue-700 hover:shadow-lg"
                    >
                      Apply Now
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default JobDetails;