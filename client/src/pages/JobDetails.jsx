import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { MapPin, Calendar, BriefcaseBusiness } from "lucide-react";

const statusStyles = {
  Pending: "bg-yellow-100 text-yellow-700",
  Reviewed: "bg-blue-100 text-blue-700",
  Accepted: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
};

function JobDetails() {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [myApplication, setMyApplication] = useState(null);
  const [checkingApplied, setCheckingApplied] = useState(true);

  useEffect(() => {
    fetchJob();
    checkIfApplied();
  }, [id]);

  const fetchJob = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get(`/jobs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setJob(res.data);
    } catch (error) {
      console.log(error);
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const matchedApplication = res.data.find(
        (application) => application.job && application.job._id === id
      );

      setMyApplication(matchedApplication || null);
    } catch (error) {
      console.log(error);
    } finally {
      setCheckingApplied(false);
    }
  };

  if (!job) {
    return <div className="text-center mt-10 text-xl">Loading...</div>;
  }

  const deadlinePassed = job.deadline && new Date() > new Date(job.deadline);

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-8">
      <h1 className="text-4xl font-bold">{job.title}</h1>

      <p className="text-xl text-gray-600 mt-2">{job.company}</p>

      <p className="mt-4 flex items-center gap-1">
        <MapPin size={18} />
        {job.location}
      </p>

      {job.deadline && (
        <p className="mt-2 flex items-center gap-1 text-gray-600">
          <Calendar size={18} />
          Apply before {new Date(job.deadline).toLocaleDateString()}
        </p>
      )}

      {job.experienceLevel && (
        <p className="mt-2 flex items-center gap-1 text-gray-600">
          <BriefcaseBusiness size={18} />
          {job.experienceLevel} experience
        </p>
      )}

      <p className="text-green-600 font-bold mt-2">
        Rs. {job.salary.toLocaleString()}
      </p>

      <p className="mt-6">{job.description}</p>

      <div className="flex gap-2 flex-wrap mt-6">
        {job.skills.map((skill, index) => (
          <span
            key={index}
            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
          >
            {skill}
          </span>
        ))}
      </div>

      {checkingApplied ? null : myApplication ? (
        <div className="mt-8">
          <p className="text-sm text-gray-500 mb-1">Your application status</p>
          <span
            className={`inline-block px-6 py-3 rounded-lg font-semibold ${
              statusStyles[myApplication.status] || statusStyles.Pending
            }`}
          >
            {myApplication.status}
          </span>
        </div>
      ) : deadlinePassed ? (
        <p className="inline-block mt-8 bg-gray-100 text-gray-600 px-6 py-3 rounded-lg font-semibold">
          Application deadline has passed
        </p>
      ) : (
        <Link
          to={`/jobs/${job._id}/apply`}
          className="inline-block mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Apply Now
        </Link>
      )}
    </div>
  );
}

export default JobDetails;