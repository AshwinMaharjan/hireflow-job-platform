import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FileText, Mail, Calendar, CheckCircle2, XCircle, ChevronDown, ChevronUp } from "lucide-react";

const statusStyles = {
  Pending: "bg-yellow-100 text-yellow-700",
  Reviewed: "bg-blue-100 text-blue-700",
  Accepted: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
};

const ApplicantsPage = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const fetchApplicants = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/applications/${jobId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplications(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load applicants.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const updateStatus = async (appId, status) => {
    setUpdatingId(appId);
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/applications/${appId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplications((prev) =>
        prev.map((app) => (app._id === appId ? { ...app, status } : app))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update application status");
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleExpand = (appId) => {
    setExpandedId((prev) => (prev === appId ? null : appId));
  };

  if (loading) return <p className="p-6">Loading applicants...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (applications.length === 0) {
    return <p className="p-6 text-gray-500">No applicants yet for this job.</p>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto grid gap-4">
      <h1 className="text-2xl font-bold mb-2">
        Applicants {applications[0]?.job?.title ? `for ${applications[0].job.title}` : ""}
      </h1>

      {applications.map((app) => {
        const isExpanded = expandedId === app._id;
        return (
          <div key={app._id} className="border rounded-lg p-5 bg-white shadow-sm">

            {/* Summary row */}
            <div className="flex justify-between items-start gap-4">
              <div>
                <h2 className="text-lg font-semibold">{app.candidate?.name}</h2>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <Mail size={14} />
                  {app.candidate?.email}
                </p>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <Calendar size={14} />
                  Applied {new Date(app.createdAt).toLocaleDateString()}
                </p>
              </div>

              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${
                  statusStyles[app.status] || statusStyles.Pending
                }`}
              >
                {app.status}
              </span>
            </div>

            {/* Toggle details */}
            <button
              onClick={() => toggleExpand(app._id)}
              className="flex items-center gap-1 text-blue-600 text-sm mt-4"
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
              <div className="mt-4 pt-4 border-t grid gap-3">

              

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Cover Letter</p>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">
                    {app.coverLetter && app.coverLetter.trim().length > 0
                      ? app.coverLetter
                      : "No cover letter submitted"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">CV / Resume</p>
                  {app.resumeUrl ? (
                    <a
                      href={app.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 underline text-sm"
                    >
                      <FileText size={16} />
                      View / Download CV
                    </a>
                  ) : (
                    <p className="text-sm text-gray-400">No CV uploaded</p>
                  )}
                </div>

              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => updateStatus(app._id, "Reviewed")}
                disabled={updatingId === app._id}
                className="text-sm px-3 py-1.5 rounded border border-blue-600 text-blue-600 disabled:opacity-50"
              >
                Mark Reviewed
              </button>
              <button
                onClick={() => updateStatus(app._id, "Accepted")}
                disabled={updatingId === app._id}
                className="flex items-center gap-1 text-sm px-3 py-1.5 rounded bg-green-600 text-white disabled:opacity-50"
              >
                <CheckCircle2 size={14} />
                Approve
              </button>
              <button
                onClick={() => updateStatus(app._id, "Rejected")}
                disabled={updatingId === app._id}
                className="flex items-center gap-1 text-sm px-3 py-1.5 rounded bg-red-600 text-white disabled:opacity-50"
              >
                <XCircle size={14} />
                Reject
              </button>
            </div>

          </div>
        );
      })}
    </div>
  );
};

export default ApplicantsPage;