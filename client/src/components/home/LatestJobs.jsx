import { Link } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import JobCard from "../JobCard";
import LoadingSkeleton from "./LoadingSkeleton";
import EmptyState from "./EmptyState";

function LatestJobs({
  jobs,
  loading,
  title = "Latest Opportunities",
  hasActiveFilters = false,
  onClearFilters,
}) {
 
  const latestJobs = jobs.slice(0, 3); //3 latest jobs dhekam so that dherai pagination feature halna naparos

  return (
    <section className="mt-12">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          <p className="mt-1 text-gray-500">
            Discover the newest opportunities waiting for you.
          </p>
        </div>

        {!loading && (
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
              {jobs.length} Job{jobs.length !== 1 && "s"} Available
            </span>

            {jobs.length > 3 && (
              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                View All Jobs
                <ArrowRight size={16} />
              </Link>
            )}
          </div>
        )}
      </div>


      {loading ? (
        <LoadingSkeleton count={3} />
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No jobs found"
          description={
            hasActiveFilters
              ? "No jobs match your search. Try adjusting your filters."
              : "There are currently no jobs available. Please check back later."
          }
          actionLabel={hasActiveFilters ? "Clear Filters" : undefined}
          onAction={hasActiveFilters ? onClearFilters : undefined}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {latestJobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </section>
  );
}

export default LatestJobs;