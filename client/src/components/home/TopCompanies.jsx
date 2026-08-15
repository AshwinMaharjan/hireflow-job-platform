import { useMemo } from "react";
import { Building2 } from "lucide-react";

const AVATAR_GRADIENTS = [
  "from-blue-500 to-violet-500",
  "from-violet-500 to-fuchsia-500",
  "from-amber-500 to-orange-500",
  "from-emerald-500 to-teal-500",
  "from-blue-500 to-cyan-500",
  "from-rose-500 to-pink-500",
];

function TopCompanies({ jobs }) {
  const companies = useMemo(() => {
    const counts = {};
    jobs.forEach((job) => {
      if (!job.company) return;
      counts[job.company] = (counts[job.company] || 0) + 1;
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({ name, count }));
  }, [jobs]);

  if (companies.length === 0) return null;

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Top Companies
          </p>
          <h2 className="mt-1 text-3xl font-bold text-gray-900">
            Teams hiring on HireFlow right now
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {companies.map((company, i) => (
            <div
              key={company.name}
              className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg"
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-bold text-white ${
                  AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length]
                }`}
              >
                {company.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {company.name}
                </p>
                <p className="flex items-center gap-1 text-xs text-gray-500">
                  <Building2 size={11} />
                  {company.count} open role{company.count !== 1 && "s"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TopCompanies;