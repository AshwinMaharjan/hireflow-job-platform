import { Link } from "react-router-dom";

function ApplicationCard({ application }) {
  if (!application.job) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-500">
          This job is no longer available
        </h2>
        <p className="mt-3">
          Status:
          <span className="font-semibold ml-2">{application.status}</span>
        </p>
        <p className="text-gray-500 mt-2">
          Applied: {new Date(application.createdAt).toLocaleDateString()}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold">{application.job.title}</h2>

      <p className="text-gray-600">{application.job.company}</p>
      {/* <p className="text-gray-600">{application.job.employmentType}</p>
      <p className="text-gray-600">{application.job.location}</p> */}

      <p className="mt-3">
        Status:
        <span className="font-semibold ml-2">{application.status}</span>
      </p>
      
      <p className="text-gray-500 mt-2">
        Applied: {new Date(application.createdAt).toLocaleDateString()}
      </p>

      <Link
        to={`/jobs/${application.job._id}`}
        className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        View Job
      </Link>
    </div>
  );
}

export default ApplicationCard;
