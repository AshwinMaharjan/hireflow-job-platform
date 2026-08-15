import { useCallback, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UploadCloud, FileText, X, AlertCircle, CheckCircle2 } from "lucide-react";
import api from "../services/api";
import Footer from "../components/home/Footer";

const MAX_RESUME_BYTES = 5 * 1024 * 1024; // 5MB vanda badi upload garna napai(sayad 2mb matra haleni pugxa hola)

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function validateResume(file) {
  if (!file) return "Please upload your resume.";
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    return "Resume must be a PDF file.";
  }
  if (file.size > MAX_RESUME_BYTES) {
    return "Resume must be smaller than 5MB.";
  }
  return "";
}

function ApplyJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState(null);
  const [resumeError, setResumeError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const applyResumeFile = (file) => {
    const error = validateResume(file);
    setResumeError(error);
    setResume(error ? null : file);
  };

  const handleFileChange = (e) => {
    applyResumeFile(e.target.files[0]);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) applyResumeFile(file);
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeResume = () => {
    setResume(null);
    setResumeError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    const error = validateResume(resume);
    if (error) {
      setResumeError(error);
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

      setSubmitted(true);
      setTimeout(() => navigate("/candidate/dashboard"), 1200);
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Application failed. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="min-h-screen bg-neutral-50 px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-neutral-900">Apply for job</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Add an optional cover letter and attach your resume as a PDF.
        </p>

        {submitted && (
          <div className="mt-6 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
            <div>
              <p className="text-sm font-semibold text-green-800">Application submitted</p>
              <p className="text-sm text-green-700">Taking you to your dashboard…</p>
            </div>
          </div>
        )}

        {!submitted && submitError && (
          <div className="mt-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
            <div>
              <p className="text-sm font-semibold text-red-800">Couldn't submit application</p>
              <p className="text-sm text-red-700">{submitError}</p>
            </div>
          </div>
        )}

        {!submitted && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-6" noValidate>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="cover-letter" className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Cover letter (optional)
                </label>
                <span className="text-xs text-neutral-400">{coverLetter.length}/2000</span>
              </div>
              <textarea
                id="cover-letter"
                rows={6}
                maxLength={2000}
                placeholder="Tell the hiring team why you're a great fit for this role…"
                className="block w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 shadow-sm transition duration-150 ease-out placeholder:text-neutral-400 hover:border-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Resume (PDF)</label>

              {!resume ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && fileInputRef.current?.click()}
                  aria-describedby={resumeError ? "resume-error" : undefined}
                  className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-10 text-center transition duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
                    isDragging
                      ? "border-primary-400 bg-primary-50"
                      : resumeError
                      ? "border-red-300 bg-red-50/30"
                      : "border-neutral-300 bg-neutral-50 hover:border-neutral-400 hover:bg-neutral-100"
                  }`}
                >
                  <UploadCloud className={`h-8 w-8 ${isDragging ? "text-primary-500" : "text-neutral-400"}`} />
                  <p className="text-sm font-medium text-neutral-700">
                    <span className="text-primary-600">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-neutral-400">PDF up to 5MB</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                    disabled={loading}
                    className="sr-only"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-white p-3.5 shadow-sm">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-neutral-900">{resume.name}</p>
                      <p className="text-xs text-neutral-500">{formatBytes(resume.size)}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeResume}
                    disabled={loading}
                    aria-label="Remove resume"
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-neutral-500 transition duration-150 ease-out hover:bg-neutral-100 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:text-neutral-300"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}

              {resumeError && (
                <p id="resume-error" className="flex items-center gap-1 text-xs font-medium text-red-600">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {resumeError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
            >
              {loading && (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              )}
              {loading ? "Submitting…" : "Submit Application"}
            </button>
          </form>
        )}
      </div>
    </div>
      <Footer />
      </>
  );
}

export default ApplyJob;