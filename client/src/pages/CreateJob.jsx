import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateJob = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    location: "",
    employmentType: "",
    experienceLevel: "",
    salary: "",
    skills: "",
    deadline: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const payload = {
        ...formData,
        salary: Number(formData.salary),
        skills: formData.skills
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s.length > 0),
        // status is not set here - the backend defaults new jobs to "Draft".
        // Recruiters publish the job from the dashboard toggle once ready.
      };

      await axios.post("http://localhost:5000/api/jobs", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate("/recruiter/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create job.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Post a New Job</h1>

      <p className="text-sm text-gray-500 mb-4">
        Your job will be saved as a <strong>Draft</strong>. You can publish it
        from your dashboard once you're ready for candidates to see it.
      </p>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="grid gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="border rounded p-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Company</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="border rounded p-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="border rounded p-2 w-full"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="border rounded p-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Employment Type</label>
          <select
            name="employmentType"
            value={formData.employmentType}
            onChange={handleChange}
            className="border rounded p-2 w-full"
            required
          >
            <option value="">Select type</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
            <option value="Remote">Remote</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Experience Level</label>
          <select
            name="experienceLevel"
            value={formData.experienceLevel}
            onChange={handleChange}
            className="border rounded p-2 w-full"
            required
          >
            <option value="">Select experience level</option>
            <option value="Fresher">Fresher</option>
            <option value="1 Year">1 Year</option>
            <option value="2 Years">2 Years</option>
            <option value="3 Years">3 Years</option>
            <option value="4+ Years">4+ Years</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Salary</label>
          <input
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            className="border rounded p-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Skills (comma-separated)
          </label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="e.g. React, Node.js, MongoDB"
            className="border rounded p-2 w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Application Deadline
          </label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            min={new Date().toISOString().split("T")[0]}
            className="border rounded p-2 w-full"
            required
          />
        </div>

        <div className="flex gap-3 mt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {saving ? "Posting..." : "Post Job"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/recruiter/dashboard")}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJob;