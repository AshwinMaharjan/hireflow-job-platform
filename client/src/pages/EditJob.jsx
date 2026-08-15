import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  FileText,
  MapPin,
  GraduationCap,
  Banknote,
  Tag,
  CalendarClock,
  X,
  Loader2,
  Info,
  AlertTriangle,
  Pencil,
  Eye,
  RefreshCw,
  FileEdit,
  Rocket,
  XCircle,
} from "lucide-react";

const EMPLOYMENT_TYPES = [
  "Full-Time",
  "Part-Time",
  "Internship",
  "Contract",
  "Remote",
];

const EXPERIENCE_LEVELS = ["Fresher", "1 Year", "2 Years", "3 Years", "4+ Years"];

const STATUS_STYLES = {
  Draft: { bg: "bg-gray-100", text: "text-gray-700", icon: FileEdit },
  Published: { bg: "bg-green-100", text: "text-green-700", icon: Rocket },
  Closed: { bg: "bg-red-100", text: "text-red-700", icon: XCircle },
};

function authHeaders() {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
}

const EditJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    location: "",
    employmentType: "",
    experienceLevel: "",
    salary: "",
    deadline: "",
  });

  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  const [jobStatus, setJobStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const fetchJob = async () => {
    try {
      setLoading(true);
      setLoadError("");

      const res = await axios.get(
        `http://localhost:5000/api/jobs/${jobId}`,
        authHeaders(),
      );

      const job = res.data;

      setFormData({
        title: job.title || "",
        company: job.company || "",
        description: job.description || "",
        location: job.location || "",
        employmentType: job.employmentType || "",
        experienceLevel: job.experienceLevel || "",
        salary: job.salary ?? "",
        deadline: job.deadline ? job.deadline.substring(0, 10) : "",
      });

      setSkills(Array.isArray(job.skills) ? job.skills : []);
      setJobStatus(job.status || "");
    } catch (err) {
      console.error(err);
      setLoadError("We couldn't load this job's details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();

    
  }, [jobId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  
  

  const addSkill = (raw) => {
    const value = raw.trim();
    if (!value) return;
    if (skills.some((s) => s.toLowerCase() === value.toLowerCase())) {
      setSkillInput("");
      return;
    }
    setSkills((prev) => [...prev, value]);
    setSkillInput("");
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(skillInput);
    } else if (e.key === "Backspace" && !skillInput && skills.length > 0) {
      setSkills((prev) => prev.slice(0, -1));
    }
  };

  const removeSkill = (skill) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

 
  
  const validate = () => {
    const errors = {};
    const salaryNum = Number(formData.salary);

    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.company.trim()) errors.company = "Company is required";
    if (!formData.description.trim())
      errors.description = "Description is required";
    if (!formData.location.trim()) errors.location = "Location is required";
    if (!formData.employmentType)
      errors.employmentType = "Select an employment type";
    if (!formData.experienceLevel)
      errors.experienceLevel = "Select an experience level";
    if (!formData.deadline) errors.deadline = "Deadline is required";

    if (
      formData.salary === "" ||
      isNaN(salaryNum) ||
      salaryNum < 0 ||
      salaryNum > 150000
    ) {
      errors.salary = "Salary must be between 0 and 1,50,000";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validate()) {
      setError("Please fix the highlighted fields before continuing.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        ...formData,
        salary: Number(formData.salary),
        skills,

        
      };

      await axios.put(
        `http://localhost:5000/api/jobs/${jobId}`,
        payload,
        authHeaders(),
      );

      navigate("/recruiter/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update job.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass = (field) =>
    `w-full rounded-xl border pl-10 pr-4 py-3 outline-none transition focus:ring-2 focus:ring-primary-500 ${
      fieldErrors[field] ? "border-red-300" : "border-gray-200"
    }`;

  const selectClass = (field) =>
    `w-full rounded-xl border pl-10 pr-4 py-3 appearance-none outline-none transition focus:ring-2 focus:ring-primary-500 ${
      fieldErrors[field] ? "border-red-300" : "border-gray-200"
    }`;

  const formattedSalary =
    formData.salary && !isNaN(Number(formData.salary))
      ? `Rs.${Number(formData.salary).toLocaleString("en-IN")}/mo`
      : null;

  const formattedDeadline = formData.deadline
    ? new Date(formData.deadline).toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  const statusStyle = STATUS_STYLES[jobStatus] || STATUS_STYLES.Draft;
  const StatusIcon = statusStyle.icon;

  

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-5 py-8">
        <div className="rounded-3xl bg-white border shadow-sm py-24 flex flex-col items-center justify-center">
          <RefreshCw size={42} className="animate-spin text-primary-600 mb-5" />
          <h3 className="text-xl font-semibold">Loading Job Details...</h3>
          <p className="text-gray-500 mt-2">
            Please wait while we fetch this listing.
          </p>
        </div>
      </div>
    );
  }

  

  if (loadError) {
    return (
      <div className="max-w-6xl mx-auto px-5 py-8">
        <div className="rounded-3xl border-2 border-dashed bg-white py-24 text-center">
          <AlertTriangle size={56} className="mx-auto text-red-300 mb-5" />
          <h2 className="text-2xl font-bold text-gray-800">
            Couldn't Load This Job
          </h2>
          <p className="text-gray-500 mt-3 max-w-md mx-auto">{loadError}</p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={fetchJob}
              className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-white hover:bg-primary-700 transition"
            >
              <RefreshCw size={16} />
              Retry
            </button>
            <button
              onClick={() => navigate("/recruiter/dashboard")}
              className="rounded-xl border px-6 py-3 text-gray-600 hover:bg-gray-50 transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-5 py-8">
      {/* Header */}
      <button
        onClick={() => navigate("/recruiter/dashboard")}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition hover:text-primary-600"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </button>

      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
          <Pencil size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Job</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Update the listing details below.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6 items-start">


        <div className="lg:col-span-2 space-y-6">


          <section className="rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="mb-5 font-semibold text-lg text-gray-900">
              Basic Details
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Briefcase
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Frontend Developer"
                    className={inputClass("title")}
                  />
                </div>
                {fieldErrors.title && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.title}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Company <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="e.g. Acme Inc."
                    className={inputClass("company")}
                  />
                </div>
                {fieldErrors.company && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.company}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Description <span className="text-red-500">*</span>
                </label>
                <span className="text-xs text-gray-400">
                  {formData.description.length} characters
                </span>
              </div>
              <div className="relative">
                <FileText
                  size={18}
                  className="absolute left-3 top-3.5 text-gray-400"
                />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the role, responsibilities, and what makes it a great opportunity..."
                  rows={4}
                  className={`${inputClass("description")} resize-none`}
                />
              </div>
              {fieldErrors.description && (
                <p className="mt-1 text-xs text-red-600">
                  {fieldErrors.description}
                </p>
              )}
            </div>
          </section>

        
        
          <section className="rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="mb-5 font-semibold text-lg text-gray-900">
              Job Details
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Location <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Bengaluru, India or Remote"
                    className={inputClass("location")}
                  />
                </div>
                {fieldErrors.location && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.location}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Employment Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Briefcase
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <select
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleChange}
                    className={selectClass("employmentType")}
                  >
                    <option value="">Select type</option>
                    {EMPLOYMENT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                {fieldErrors.employmentType && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.employmentType}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Experience Level <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <GraduationCap
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    className={selectClass("experienceLevel")}
                  >
                    <option value="">Select experience level</option>
                    {EXPERIENCE_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
                {fieldErrors.experienceLevel && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.experienceLevel}
                  </p>
                )}
              </div>
            </div>
          </section>



          <section className="rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="mb-5 font-semibold text-lg text-gray-900">
              Compensation &amp; Skills
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Monthly Salary (Rs.) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Banknote
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    min="0"
                    max="150000"
                    placeholder="e.g. 45000"
                    className={inputClass("salary")}
                  />
                </div>
                {fieldErrors.salary ? (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.salary}
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-gray-400">
                    Between Rs.0 and Rs.1,50,000
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Application Deadline <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <CalendarClock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className={inputClass("deadline")}
                  />
                </div>
                {fieldErrors.deadline && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.deadline}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Skills
              </label>
              <div className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 focus-within:ring-2 focus-within:ring-primary-500">
                <Tag size={16} className="shrink-0 text-gray-400" />
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-primary-400 transition hover:text-primary-700"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  onBlur={() => addSkill(skillInput)}
                  placeholder={
                    skills.length === 0 ? "e.g. React, Node.js, MongoDB" : ""
                  }
                  className="min-w-[120px] flex-1 border-none py-0.5 text-sm outline-none"
                />
              </div>
              <p className="mt-1.5 text-xs text-gray-400">
                Press Enter or comma to add a skill
              </p>
            </div>
          </section>
        </div>



        <div className="lg:sticky lg:top-6 space-y-4">
          {/* Error banner */}
          {error && (
            <div className="flex items-start gap-2 rounded-2xl bg-red-50 p-3.5 text-sm text-red-700">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          {/* Status + Actions card */}
          <section className="rounded-3xl border bg-white p-6 shadow-sm">
            {jobStatus && (
              <div className="mb-4 flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                <span className="text-xs font-medium text-gray-500">
                  Current status
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}
                >
                  <StatusIcon size={12} />
                  {jobStatus}
                </span>
              </div>
            )}

            <div className="flex flex-col gap-2.5">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate("/recruiter/dashboard")}
                className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-3.5 text-xs text-blue-700">
              <Info size={16} className="mt-0.5 shrink-0" />
              <p>
                Use the <strong>Publish / Close / Reopen</strong> buttons on
                your dashboard to change the job's status.
              </p>
            </div>
          </section>

          {/* Live preview card */}
          <section className="rounded-3xl border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-gray-500">
              <Eye size={16} />
              <h3 className="text-sm font-semibold">Preview</h3>
            </div>

            <h4 className="font-bold text-gray-900 break-words">
              {formData.title || "Job title"}
            </h4>
            <p className="mt-0.5 text-sm text-gray-500 break-words">
              {formData.company || "Company name"}
            </p>

            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="shrink-0 text-primary-600" />
                <span className="break-words">
                  {formData.location || "Location"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase size={14} className="shrink-0 text-primary-600" />
                <span>{formData.employmentType || "Employment type"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Banknote size={14} className="shrink-0 text-primary-600" />
                <span>{formattedSalary || "Salary"}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarClock size={14} className="shrink-0 text-primary-600" />
                <span>
                  {formattedDeadline
                    ? `Deadline ${formattedDeadline}`
                    : "Deadline"}
                </span>
              </div>
            </div>

            {skills.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5 border-t pt-4">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </section>
        </div>
      </form>
    </div>
  );
};

export default EditJob;