import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  MapPin,
  Calendar,
  BriefcaseBusiness,
  ArrowRight,
  FileWarning,
  Clock3,
  CheckCircle2,
  Eye,
  XCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Trash2,
  AlertTriangle,
  Loader2,
} from "lucide-react";

const STATUS_ORDER = ["Pending", "Reviewed", "Accepted"];

function ApplicationCard({ application, onWithdraw }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirmingWithdraw, setConfirmingWithdraw] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawn, setWithdrawn] = useState(false);

  const statusStyles = {
    Pending: {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      dot: "bg-yellow-500",
      icon: <Clock3 size={16} />,
    },
    Reviewed: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      dot: "bg-blue-500",
      icon: <Eye size={16} />,
    },
    Accepted: {
      bg: "bg-green-100",
      text: "text-green-700",
      dot: "bg-green-500",
      icon: <CheckCircle2 size={16} />,
    },
    Rejected: {
      bg: "bg-red-100",
      text: "text-red-700",
      dot: "bg-red-500",
      icon: <XCircle size={16} />,
    },
  };

  const status =
    statusStyles[application.status] || {
      bg: "bg-gray-100",
      text: "text-gray-700",
      dot: "bg-gray-400",
      icon: null,
    };

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(application._id || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
     
    }
  };

  const handleWithdraw = async () => {
    setWithdrawing(true);
    try {
      if (onWithdraw) {
        await onWithdraw(application._id);
      }
      setWithdrawn(true);
    } finally {
      setWithdrawing(false);
      setConfirmingWithdraw(false);
    }
  };

  const canWithdraw =
    !withdrawn &&
    application.status !== "Accepted" &&
    application.status !== "Rejected";

  const stepIndex = STATUS_ORDER.indexOf(application.status);
  const isRejected = application.status === "Rejected";

  if (withdrawn) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-gray-200 p-3">
            <Trash2 className="text-gray-500" size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-700">
              Application Withdrawn
            </h2>
            <p className="text-gray-500 mt-1 text-sm">
              You withdrew your application for{" "}
              {application.job?.title || "this job"}.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!application.job) {
    return (
      <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-red-100 p-3">
            <FileWarning className="text-red-600" size={28} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Job No Longer Available
            </h2>

            <p className="text-gray-500 mt-1">
              This job posting has been removed by the employer.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center border-t pt-5">
          <span
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${status.bg} ${status.text}`}
          >
            {status.icon}
            {application.status}
          </span>

          <span className="text-sm text-gray-500">
            Applied{" "}
            {new Date(application.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    );
  }

  const job = application.job;
  const companyInitial = job.company?.charAt(0).toUpperCase() || "C";
  const visibleSkills = expanded ? job.skills : job.skills?.slice(0, 4);

  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-primary-300 hover:shadow-xl">
      <div className="h-1 bg-gradient-to-r from-primary-500 via-blue-500 to-indigo-500" />

      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-100 text-xl font-bold text-primary-700">
              {companyInitial}
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition">
                {job.title}
              </h2>

              <div className="mt-1 flex items-center gap-2 text-gray-500">
                <Building2 size={16} />
                {job.company}
              </div>
            </div>
          </div>

          <div className="group/status relative">
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold ${status.bg} ${status.text} cursor-default`}
            >
              {status.icon}
              {application.status}
            </span>

            {/* Tooltip */}
            <div className="pointer-events-none absolute right-0 top-full z-10 mt-2 w-48 rounded-lg bg-gray-900 px-3 py-2 text-xs text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover/status:opacity-100">
              {application.status === "Pending" &&
                "Your application is waiting to be reviewed."}
              {application.status === "Reviewed" &&
                "The employer has reviewed your application."}
              {application.status === "Accepted" &&
                "Congratulations! Your application was accepted."}
              {application.status === "Rejected" &&
                "This application was not selected."}
            </div>
          </div>
        </div>

        {/* Status progress tracker */}
        {!isRejected && (
          <div className="mt-6 flex items-center">
            {STATUS_ORDER.map((step, i) => (
              <div key={step} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-colors ${
                      i <= stepIndex
                        ? `${status.dot} text-white`
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {i < stepIndex ? <Check size={12} /> : i + 1}
                  </div>
                  <span
                    className={`mt-1 text-[10px] font-medium ${
                      i <= stepIndex ? "text-gray-700" : "text-gray-400"
                    }`}
                  >
                    {step}
                  </span>
                </div>

                {i < STATUS_ORDER.length - 1 && (
                  <div
                    className={`mx-2 h-0.5 flex-1 rounded transition-colors ${
                      i < stepIndex ? status.dot : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Details */}
        <div className="mt-6 space-y-3 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <MapPin size={17} className="text-primary-600" />
            {job.location}
          </div>

          {job.employmentType && (
            <div className="flex items-center gap-2">
              <BriefcaseBusiness size={17} className="text-primary-600" />
              {job.employmentType}
            </div>
          )}

          {job.salary && (
            <div className="flex items-center gap-2">
              Rs. {Number(job.salary).toLocaleString()}
            </div>
          )}

          <div className="flex items-center gap-2">
            <Calendar size={17} className="text-primary-600" />
            Applied on {new Date(application.createdAt).toLocaleDateString()}
          </div>

          {expanded && job.description && (
            <p className="pt-2 text-gray-500 leading-relaxed">
              {job.description}
            </p>
          )}
        </div>

        {/* Skills */}
        {job.skills?.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {visibleSkills.map((skill, index) => (
              <span
                key={index}
                className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-primary-100 hover:text-primary-700 transition"
              >
                {skill}
              </span>
            ))}

            {!expanded && job.skills.length > 4 && (
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-600 transition hover:bg-gray-300"
              >
                +{job.skills.length - 4} more
              </button>
            )}
          </div>
        )}

        {/* Expand/collapse toggle */}
        {(job.skills?.length > 4 || job.description) && (
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700"
          >
            {expanded ? (
              <>
                Show less <ChevronUp size={14} />
              </>
            ) : (
              <>
                Show more <ChevronDown size={14} />
              </>
            )}
          </button>
        )}

        {/* Withdraw confirmation */}
        {confirmingWithdraw && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle
                size={18}
                className="mt-0.5 shrink-0 text-red-500"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-700">
                  Withdraw this application?
                </p>
                <p className="mt-1 text-xs text-red-600">
                  This can't be undone. The employer will no longer see your
                  application for {job.title}.
                </p>

                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={handleWithdraw}
                    disabled={withdrawing}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                  >
                    {withdrawing && (
                      <Loader2 size={14} className="animate-spin" />
                    )}
                    {withdrawing ? "Withdrawing..." : "Yes, withdraw"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingWithdraw(false)}
                    disabled={withdrawing}
                    className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 ring-1 ring-gray-300 transition hover:bg-gray-50 disabled:opacity-60"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 flex items-center justify-between border-t pt-5">
          <div className="flex items-center gap-2">
            <Link
              to={`/jobs/${job._id}`}
              className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
            >
              View Job
              <ArrowRight size={16} />
            </Link>

            {canWithdraw && (
              <button
                type="button"
                onClick={() => setConfirmingWithdraw((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50"
              >
                <Trash2 size={16} />
                Withdraw
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleCopyId}
            title="Copy application ID"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 transition hover:text-primary-600"
          >
            {copied ? (
              <>
                <Check size={14} className="text-green-500" />
                <span className="text-green-500">Copied</span>
              </>
            ) : (
              <>
                
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ApplicationCard;