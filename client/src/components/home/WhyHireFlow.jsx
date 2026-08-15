import { ShieldCheck, BellRing, Zap } from "lucide-react";

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: "Verified employers only",
    description:
      "Every company on HireFlow is reviewed before they can post, so you're never applying into a black hole.",
    accent: "bg-blue-50 text-blue-600",
  },
  {
    icon: BellRing,
    title: "Real-time updates",
    description:
      "Get notified the moment your application status changes, no refreshing, no guessing where you stand.",
    accent: "bg-violet-50 text-violet-600",
  },
  {
    icon: Zap,
    title: "Apply in minutes",
    description:
      "One profile, every application. Save your details once and apply to new roles in a couple of clicks.",
    accent: "bg-amber-50 text-amber-600",
  },
];

function WhyHireFlow() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-semibold tracking-wide text-blue-600">
            Why HireFlow
          </p>
          <h2 className="mt-1 text-3xl font-bold text-gray-900">
            Built to get you hired faster
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {BENEFITS.map(({ icon: Icon, title, description, accent }) => (
            <div
              key={title}
              className="rounded-2xl border border-gray-100 bg-gray-50 p-7 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg"
            >
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${accent}`}>
                <Icon size={22} />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-gray-900">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyHireFlow;