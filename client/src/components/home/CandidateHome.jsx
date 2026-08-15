import { useEffect, useMemo, useState } from "react";
import { Lightbulb, FileText, MessageSquare, BellRing } from "lucide-react";
import api from "../../services/api";
import SearchBar from "./SearchBar";
import LatestJobs from "./LatestJobs";
import Footer from "./Footer";

const isAcceptedStatus = (status) => /accept/i.test(status || "");

function CandidateHome({ user }) {
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);

  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm, setLocationTerm] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [sortBy, setSortBy] = useState("Newest");

  useEffect(() => {
    fetchJobs();
    fetchDashboardData();
  }, []);

  const authHeaders = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

  const fetchJobs = async () => {
    try {
      setJobsLoading(true);
      const res = await api.get("/jobs", { headers: authHeaders() });
      setJobs(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setJobsLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setDashboardLoading(true);

      const [applicationsRes, notificationsRes] = await Promise.allSettled([
        api.get("/applications/my", { headers: authHeaders() }),
        api.get("/notifications", { headers: authHeaders() }),
      ]);

      if (applicationsRes.status === "fulfilled") {
        setApplications(applicationsRes.value.data || []);
      } else {
        console.error(applicationsRes.reason);
      }

      if (notificationsRes.status === "fulfilled") {
        setNotifications(notificationsRes.value.data || []);
      } else {
        console.error(notificationsRes.reason);
      }
    } finally {
      setDashboardLoading(false);
    }
  };

  const jobsById = useMemo(() => {
    const map = {};
    jobs.forEach((job) => {
      map[job._id] = job;
    });
    return map;
  }, [jobs]);

  const stats = useMemo(
    () => ({
      applications: applications.length,
      savedJobs: user?.savedJobs?.length || 0,
      accepted: applications.filter((app) => isAcceptedStatus(app.status))
        .length,
      unreadNotifications: notifications.filter((n) => !n.isRead).length,
    }),
    [applications, notifications, user],
  );

  const recommendedJobs = useMemo(() => {
    const candidateSkills = (user?.skills || []).map((s) => s.toLowerCase());

    if (candidateSkills.length === 0) {
      return [...jobs]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 4);
    }

    return [...jobs]
      .map((job) => {
        const overlap = (job.skills || []).filter((skill) =>
          candidateSkills.includes(skill.toLowerCase()),
        ).length;
        return { job, overlap };
      })
      .filter((entry) => entry.overlap > 0)
      .sort((a, b) => b.overlap - a.overlap)
      .slice(0, 4)
      .map((entry) => entry.job);
  }, [jobs, user]);

  const clearFilters = () => {
    setSearchTerm("");
    setLocationTerm("");
    setEmploymentType("");
    setSortBy("Newest");
  };

  const hasActiveFilters =
    searchTerm || locationTerm || employmentType || sortBy !== "Newest";

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
      return matchesSearch && matchesLocation && matchesEmployment;
    });

    switch (sortBy) {
      case "Oldest":
        data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "Company":
        data.sort((a, b) => (a.company || "").localeCompare(b.company || ""));
        break;
      case "Job Title":
        data.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        break;
      default:
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return data;
  }, [jobs, searchTerm, locationTerm, employmentType, sortBy]);

  const profileCompletion = useMemo(() => {
    if (!user) return 0;
    const checks = [
      Boolean(user.name),
      Boolean(user.email),
      Boolean(user.isVerified),
      (user.skills || []).length > 0,
    ];
    const filled = checks.filter(Boolean).length;
    return Math.round((filled / checks.length) * 100);
  }, [user]);

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Personalized hero */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-10">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              {/* Left */}
              <div>
                <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  Candidate Dashboard
                </span>

                <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
                  Welcome back, {firstName}
                </h1>

                <p className="mt-2 max-w-xl text-slate-600">
                  Discover new opportunities, manage your applications, and take the next step in your career, all from one place.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mb-8">
        <SearchBar
          title="Find Your Next Role"
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

      <div className="mx-auto w-full max-w-7xl px-4 lg:px-6">
        <LatestJobs
          jobs={filteredJobs}
          loading={jobsLoading}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />
      </div>
        <Footer />
    </div>
  );
}

export default CandidateHome;
