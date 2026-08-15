import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import JobCard from "../components/JobCard";
import Footer from "../components/home/Footer";
import LoadingSkeleton from "../components/home/LoadingSkeleton";
import EmptyState from "../components/home/EmptyState";
import { Bookmark, RefreshCw, AlertTriangle } from "lucide-react";

const SavedJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      const res = await api.get("/users/saved-jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setJobs(res.data);
    } catch (err) {
      console.error(err);
      setError("We couldn't load your saved jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);


  
  const handleUnsave = (jobId) => {
    setJobs((prev) => prev.filter((job) => job._id !== jobId));
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
              <Bookmark size={22} className="fill-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Saved Jobs</h1>
              <p className="mt-0.5 text-sm text-gray-500">
                {loading
                  ? "Loading your saved jobs..."
                  : jobs.length > 0
                  ? `${jobs.length} job${jobs.length > 1 ? "s" : ""} you've bookmarked`
                  : "Jobs you bookmark will show up here"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 lg:px-6">
        {loading ? (
          <LoadingSkeleton count={6} />
        ) : error ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50 px-6 py-16 text-center">
            <AlertTriangle className="mb-4 text-red-500" size={32} />
            <p className="mb-4 font-medium text-red-700">{error}</p>
            <button
              onClick={fetchSavedJobs}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              <RefreshCw size={16} />
              Try again
            </button>
          </div>
        ) : jobs.length === 0 ? (
          <EmptyState
            icon={Bookmark}
            title="No saved jobs yet"
            description="Bookmark jobs you're interested in and they'll show up here so you can find them again easily."
            actionLabel="Browse Jobs"
            onAction={() => navigate("/jobs")}
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} isSaved={true} onUnsave={handleUnsave} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default SavedJobs;