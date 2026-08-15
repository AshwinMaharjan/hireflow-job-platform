import { memo } from "react";
import { Briefcase, Users, Eye, CheckCircle } from "lucide-react";

const defaultStats = [
  {
    label: "Active Jobs",
    value: "24",
    icon: Briefcase,
    bg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    label: "Applications",
    value: "1,248",
    icon: Users,
    bg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    label: "Profile Views",
    value: "8.4K",
    icon: Eye,
    bg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    label: "Hires Made",
    value: "96",
    icon: CheckCircle,
    bg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
];

function StatsBar({ stats = defaultStats }) {
  return (
    <div className="relative z-10 -mt-10 mb-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
  key={stat.label}
  className={`
    mt-20
    rounded-3xl
   
    ${stat.cardBg}
    p-6
    backdrop-blur-sm
    shadow-lg shadow-slate-200/40
    transition-all duration-300 ease-out
    hover:-translate-y-2
    hover:scale-[1.02]
    hover:shadow-2xl hover:shadow-slate-300/30
    hover:border-opacity-80
    cursor-default
    sm:p-7
  `}
>
            <div
              className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${stat.bg}`}
            >
              <Icon size={20} className={stat.iconColor} />
            </div>

            <p className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">
              {stat.value}
            </p>

            <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
}

export default memo(StatsBar);
