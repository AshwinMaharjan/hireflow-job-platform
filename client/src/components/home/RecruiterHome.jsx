import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  Settings2,
  Users2,
  BarChart3,
  BriefcaseBusiness,
  Briefcase,
  FileEdit,
  Rocket,
  XCircle,
  ArrowRight,
} from "lucide-react";
import api from "../../services/api";
import RecruiterDashboard from "./RecruiterDashboard";

import Footer from "./Footer";

const QUICK_ACTIONS = [
  {
    label: "Post Job",
    description: "List a new open role",
    icon: PlusCircle,
    path: "/recruiter/jobs/new",
    accent: "bg-blue-600",
  },
  {
    label: "Manage Jobs",
    description: "Edit or close postings",
    icon: Settings2,
    path: "/recruiter/jobs",
    accent: "bg-violet-600",
  },

  {
    label: "Analytics",
    description: "Track hiring performance",
    icon: BarChart3,
    path: "/recruiter/dashboard",
    accent: "bg-emerald-600",
  },
];

// Loose, case-insensitive status matching so this keeps working regardless
// of the exact enum strings your Application/Job schema ends up using.
const isShortlistStage = (status) => /shortlist|review/i.test(status || "");
const isInterviewStage = (status) => /interview/i.test(status || "");
const isHiredStage = (status) => /accept|hire/i.test(status || "");

const isDraftJob = (status) => /draft/i.test(status || "");
const isPublishedJob = (status) => /publish|active|open/i.test(status || "");
const isClosedJob = (status) => /close|expire|archiv/i.test(status || "");

// Badge styling for application status pills.
const applicationBadgeStyle = (status) => {
  if (isHiredStage(status)) return "bg-emerald-100 text-emerald-700";
  if (isInterviewStage(status)) return "bg-violet-100 text-violet-700";
  if (isShortlistStage(status)) return "bg-blue-100 text-blue-700";
  if (/reject|declin/i.test(status || "")) return "bg-red-100 text-red-700";
  return "bg-amber-100 text-amber-700"; // Pending / Applied / default
};

// Badge styling for job status pills.
const jobBadgeStyle = (status) => {
  if (isPublishedJob(status)) return "bg-emerald-100 text-emerald-700";
  if (isDraftJob(status)) return "bg-amber-100 text-amber-700";
  if (isClosedJob(status)) return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-700";
};

// The applications list endpoint isn't always a bare array — some backends
// wrap it as { applications: [...] } or { data: [...] }. Normalize so the
// rest of the component can always assume a plain array.
const normalizeApplicationsResponse = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.applications)) return payload.applications;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
};

function RecruiterHome({ user }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [myJobs, setMyJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const authHeaders = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      // /jobs already exists and returns all published jobs — filter down
      // to this recruiter's own postings client-side.
      const jobsRes = await api
        .get("/jobs", { headers: authHeaders() })
        .catch((err) => {
          console.error(err);
          return null;
        });

      const allJobs = jobsRes?.data || [];
      const recruiterJobs = allJobs.filter(
        (job) =>
          job.recruiter === user?._id || job.recruiter?._id === user?._id,
      );
      setMyJobs(recruiterJobs);

      // There's no single "all my applications" endpoint that's confirmed
      // to work — the endpoint that actually returns data (verified on the
      // Applicants page) is per-job: /applications/:jobId. So fetch that
      // for every job this recruiter owns and merge the results, the same
      // way the Applicants page does it per job.
      if (recruiterJobs.length === 0) {
        setApplications([]);
        return;
      }

      const perJobResults = await Promise.allSettled(
        recruiterJobs.map((job) =>
          api.get(`/applications/${job._id}`, { headers: authHeaders() }),
        ),
      );

      const allApplications = perJobResults.flatMap((result, idx) => {
        if (result.status !== "fulfilled") {
          console.error(
            `Failed to load applications for job ${recruiterJobs[idx]._id}`,
            result.reason,
          );
          return [];
        }
        return normalizeApplicationsResponse(result.value.data).map(
          (app) => ({
            ...app,
            // Ensure `job` is always at least resolvable even if a given
            // application record doesn't come back populated.
            job: app.job || recruiterJobs[idx],
          }),
        );
      });

      setApplications(allApplications);
    } finally {
      setLoading(false);
    }
  };

  const jobsById = useMemo(() => {
    const map = {};
    myJobs.forEach((job) => {
      map[job._id] = job;
    });
    return map;
  }, [myJobs]);

  const stats = useMemo(
    () => ({
      openJobs: myJobs.filter((job) => job.status === "Published").length,
      applications: applications.length,
      shortlisted: applications.filter((app) => isShortlistStage(app.status))
        .length,
      hired: applications.filter((app) => isHiredStage(app.status)).length,
    }),
    [myJobs, applications],
  );

  // Job-status breakdown for the "Hiring Overview" stats bar, computed
  // entirely from live /jobs data — no static/mock numbers.
  const jobStats = useMemo(
    () => ({
      total: myJobs.length,
      draft: myJobs.filter((job) => isDraftJob(job.status)).length,
      published: myJobs.filter((job) => isPublishedJob(job.status)).length,
      closed: myJobs.filter((job) => isClosedJob(job.status)).length,
    }),
    [myJobs],
  );

  // Cumulative funnel — each stage includes candidates who've moved past it.
  const funnel = useMemo(() => {
    const shortlisted = applications.filter(
      (app) =>
        isShortlistStage(app.status) ||
        isInterviewStage(app.status) ||
        isHiredStage(app.status),
    ).length;
    const interviewed = applications.filter(
      (app) => isInterviewStage(app.status) || isHiredStage(app.status),
    ).length;
    const hired = applications.filter((app) => isHiredStage(app.status)).length;

    return {
      applied: applications.length,
      shortlisted,
      interviewed,
      hired,
    };
  }, [applications]);

  const recentApplications = useMemo(() => {
    return [...applications]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map((app) => {
        const job = typeof app.job === "object" ? app.job : jobsById[app.job];
        const candidateName =
          typeof app.candidate === "object" ? app.candidate?.name : null;

        return {
          _id: app._id,
          candidateName: candidateName || "Candidate",
          jobTitle: job?.title || "Untitled role",
          appliedAt: app.createdAt,
          status: app.status,
        };
      });
  }, [applications, jobsById]);

  const applicantCountByJob = useMemo(() => {
    const counts = {};
    applications.forEach((app) => {
      const jobId = typeof app.job === "object" ? app.job._id : app.job;
      counts[jobId] = (counts[jobId] || 0) + 1;
    });
    return counts;
  }, [applications]);

  const activeJobs = useMemo(
    () =>
      myJobs.map((job) => ({
        _id: job._id,
        title: job.title,
        applicantCount: applicantCountByJob[job._id] || 0,
        status: job.status,
        postedAt: job.createdAt,
      })),
    [myJobs, applicantCountByJob],
  );

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="min-h-screen bg-gray-50">
    
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-10">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              {/* Left */}
              <div>
                <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  Recruiter Dashboard
                </span>

                <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
                  Welcome back, {firstName}
                </h1>

                <p className="mt-2 max-w-xl text-slate-600">
                  Manage your job postings, review applicants, and hire top
                  talent, all from one centralized dashboard.
                </p>
              </div>

              {/* Right */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => navigate("/recruiter/jobs/new")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]"
                >
                  <PlusCircle size={18} />
                  Post New Job
                </button>

                <button
                  onClick={() => navigate("/recruiter/my-jobs")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-slate-100"
                >
                  <BriefcaseBusiness size={18} />
                  View Jobs
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-10">

        <h2 className="mb-5 text-xl font-bold text-gray-900">
          Hiring Overview
        </h2>

        {loading ? (
          <div className="grid grid-cols-2 gap-5 mb-8 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-2xl border bg-gray-100"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 mb-8 lg:grid-cols-4">
            <div className="rounded-2xl border bg-blue-50 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-center justify-between">
                <Briefcase className="text-blue-600" />
                <span className="text-3xl font-bold text-blue-700">
                  {jobStats.total}
                </span>
              </div>
              <p className="mt-4 text-sm text-blue-700">Total Jobs</p>
            </div>

            <div className="rounded-2xl border bg-amber-50 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="flex justify-between">
                <FileEdit className="text-amber-600" />
                <span className="text-3xl font-bold text-amber-700">
                  {jobStats.draft}
                </span>
              </div>
              <p className="mt-4 text-sm text-amber-700">Draft</p>
            </div>

            <div className="rounded-2xl border bg-green-50 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="flex justify-between">
                <Rocket className="text-green-600" />
                <span className="text-3xl font-bold text-green-700">
                  {jobStats.published}
                </span>
              </div>
              <p className="mt-4 text-sm text-green-700">Published</p>
            </div>

            <div className="rounded-2xl border bg-red-50 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="flex justify-between">
                <XCircle className="text-red-600" />
                <span className="text-3xl font-bold text-red-700">
                  {jobStats.closed}
                </span>
              </div>
              <p className="mt-4 text-sm text-red-700">Closed</p>
            </div>
          </div>
        )}

        <RecruiterDashboard
          stats={stats}
          recentApplications={recentApplications}
          activeJobs={activeJobs}
          funnel={funnel}
          loading={loading}
        />

       

        
        <div className="mt-10 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-bold text-gray-900">
            Recent Applications
          </h2>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-12 animate-pulse rounded-xl bg-gray-100"
                />
              ))}
            </div>
          ) : recentApplications.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-500">
              No applications yet.
            </p>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentApplications.map((app) => (
                <div
                  key={app._id}
                  className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                    <span className="text-sm font-semibold text-gray-900">
                      {app.candidateName}
                    </span>
                    <span className="text-sm text-gray-500">
                      {app.jobTitle}
                    </span>
                  </div>
                  <span
                    className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ${applicationBadgeStyle(
                      app.status,
                    )}`}
                  >
                    {app.status || "Pending"}
                  </span>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => navigate("/recruiter/applications")}
            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
          </button>
        </div>

        <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-bold text-gray-900">
            Your Job Listings
          </h2>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-12 animate-pulse rounded-xl bg-gray-100"
                />
              ))}
            </div>
          ) : activeJobs.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-500">
              You haven't posted any jobs yet.
            </p>
          ) : (
            <div className="divide-y divide-gray-100">
              {activeJobs.map((job) => (
                <div
                  key={job._id}
                  className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="text-sm font-semibold text-gray-900">
                    {job.title}
                  </span>

                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${jobBadgeStyle(
                        job.status,
                      )}`}
                    >
                      {job.status || "Draft"}
                    </span>
                    <span className="w-16 text-right text-sm text-gray-500">
                      {isDraftJob(job.status)
                        ? "—"
                        : `${job.applicantCount} ${
                            job.applicantCount === 1 ? "App" : "Apps"
                          }`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => navigate("/recruiter/jobs")}
            className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Manage Jobs
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default RecruiterHome;