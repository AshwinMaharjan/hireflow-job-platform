import { useEffect, useState } from "react";
import axios from "axios";
import JobCard from "../components/JobCard";

const SavedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/users/saved-jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load saved jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, []);

  if (loading) return <p className="p-6">Loading saved jobs...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Saved Jobs</h1>

      {jobs.length === 0 ? (
        <p className="text-gray-500">You haven't saved any jobs yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} isSaved={true} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;