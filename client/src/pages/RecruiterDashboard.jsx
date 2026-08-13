import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Rocket, XCircle, RotateCcw } from "lucide-react";

const statusStyles = {
  Draft: "bg-gray-100 text-gray-700",
  Published: "bg-green-100 text-green-700",
  Closed: "bg-red-100 text-red-700",
};

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/jobs/my-jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyJobs();
  }, []);

  const handleDelete = async (jobId) => {
    if (!window.confirm("Delete this job? This cannot be undone.")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs((prev) => prev.filter((job) => job._id !== jobId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete job");
    }
  };

  const handleStatusChange = async (jobId, newStatus) => {
    setStatusUpdating(jobId);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `http://localhost:5000/api/jobs/${jobId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJobs((prev) =>
        prev.map((job) =>
          job._id === jobId ? { ...job, status: res.data.job.status } : job
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update job status");
    } finally {
      setStatusUpdating(null);
    }
  };

  if (loading) return <p>Loading your jobs...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Jobs</h1>
      <button
        onClick={() => navigate("/recruiter/jobs/new")}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        + Post New Job
      </button>
      {jobs.length === 0 ? (
        <p>You haven't posted any jobs yet.</p>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <div key={job._id} className="border rounded-lg p-4 flex justify-between items-center">
              <div>
                <h2 className="font-semibold">{job.title}</h2>
                <p className="text-sm text-gray-500">{job.company}</p>
                <span
                  className={`inline-block mt-2 text-xs font-semibold px-2 py-1 rounded-full ${
                    statusStyles[job.status] || statusStyles.Draft
                  }`}
                >
                  {job.status}
                </span>
              </div>
              <div className="flex gap-2 items-center flex-wrap">

                {job.status === "Draft" && (
                  <button
                    onClick={() => handleStatusChange(job._id, "Published")}
                    disabled={statusUpdating === job._id}
                    className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded text-sm disabled:opacity-50"
                  >
                    <Rocket size={14} />
                    Publish
                  </button>
                )}

                {job.status === "Published" && (
                  <button
                    onClick={() => handleStatusChange(job._id, "Closed")}
                    disabled={statusUpdating === job._id}
                    className="flex items-center gap-1 bg-red-600 text-white px-3 py-1.5 rounded text-sm disabled:opacity-50"
                  >
                    <XCircle size={14} />
                    Close
                  </button>
                )}

                {job.status === "Closed" && (
                  <button
                    onClick={() => handleStatusChange(job._id, "Published")}
                    disabled={statusUpdating === job._id}
                    className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded text-sm disabled:opacity-50"
                  >
                    <RotateCcw size={14} />
                    Reopen
                  </button>
                )}

                <button onClick={() => navigate(`/recruiter/jobs/${job._id}/applicants`)}>
                  👥 View Applicants
                </button>
                <button onClick={() => navigate(`/recruiter/jobs/${job._id}/edit`)}>
                  ✏ Edit
                </button>
                <button onClick={() => handleDelete(job._id)}>🗑 Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

  );
};

export default RecruiterDashboard;