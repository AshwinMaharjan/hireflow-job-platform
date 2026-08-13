import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Bookmark, MapPin, BriefcaseBusiness } from "lucide-react";

function JobCard({ job, isSaved = false }) {
  const [saved, setSaved] = useState(isSaved);
  const [loading, setLoading] = useState(false);

  const handleToggleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:5000/api/users/save-job/${job._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSaved(res.data.saved);
    } catch (err) {
      console.error(err);
      alert("Failed to save job. Are you logged in as a candidate?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition relative">

      <button
        onClick={handleToggleSave}
        disabled={loading}
        className="absolute top-4 right-4"
        aria-label={saved ? "Unsave job" : "Save job"}
        title={saved ? "Unsave job" : "Save job"}
      >
        <Bookmark
          size={24}
          className={saved ? "text-blue-600" : "text-gray-400"}
          fill={saved ? "currentColor" : "none"}
          strokeWidth={2}
        />
      </button>

      <h2 className="text-2xl font-bold text-slate-800 pr-8">
        {job.title}
      </h2>

      <p className="text-lg text-gray-600 mt-2">
        {job.company}
      </p>

      <p className="text-gray-500 flex items-center gap-1">
        <MapPin size={16} />
        {job.location}
      </p>

      {job.experienceLevel && (
        <p className="text-gray-500 flex items-center gap-1 mt-1">
          <BriefcaseBusiness size={16} />
          {job.experienceLevel}
        </p>
      )}

      <p className="text-green-600 font-semibold mt-2">
        Rs. {job.salary.toLocaleString()}
      </p>
      <p className="text-red-600 font-semibold mt-2">
        {job.employmentType.toLocaleString()}
      </p>

      <div className="flex flex-wrap gap-2 mt-4">

        {job.skills.map((skill, index) => (
          <span
            key={index}
            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
          >
            {skill}
          </span>
        ))}

      </div>

      <Link
        to={`/jobs/${job._id}`}
        className="inline-block mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        View Details
      </Link>

    </div>
  );
}

export default JobCard;