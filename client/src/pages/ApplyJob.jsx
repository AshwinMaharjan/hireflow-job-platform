import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function ApplyJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState(null);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resume) {
      alert("Please upload your resume.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("coverLetter", coverLetter);
      formData.append("resume", resume);

      const token = localStorage.getItem("token");

      await api.post(`/applications/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Application submitted successfully!");

      navigate("/candidate/dashboard");

    } catch (error) {
      alert(
        error.response?.data?.message || "Application failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-8">

      <h1 className="text-3xl font-bold mb-6">
        Apply for Job
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div>

          <label className="block mb-2 font-semibold">
            Cover Letter (Optional)
          </label>

          <textarea
            rows="6"
            className="w-full border rounded-lg p-4"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
          />

        </div>

        <div>

          <label className="block mb-2 font-semibold">
            Resume (PDF)
          </label>

          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setResume(e.target.files[0])}
          />

        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          {loading ? "Submitting..." : "Submit Application"}
        </button>

      </form>

    </div>
  );
}

export default ApplyJob;