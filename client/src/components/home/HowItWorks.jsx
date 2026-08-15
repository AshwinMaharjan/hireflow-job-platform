import { UserPlus, FileEdit, Send, Award } from "lucide-react";

const STEPS = [
  {
    icon: UserPlus,
    step: "01",
    title: "Register",
    description: "Create your free HireFlow account in under a minute.",
  },
  {
    icon: FileEdit,
    step: "02",
    title: "Browse Jobs",
    description: "Discover opportunities that match your skills, interests, and career goals. ",
  },
  {
    icon: Send,
    step: "03",
    title: "Apply",
    description: "Browse matched roles and apply with one click using your saved profile.",
  },
  {
    icon: Award,
    step: "04",
    title: "Get Hired",
    description: "Track every application in real time, right through to the offer.",
  },
];

function HowItWorks() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-12 max-w-2xl">
          <p className="text-sm font-semibold tracking-wide text-blue-600">
            How It Works
          </p>
          <h2 className="mt-1 text-3xl font-bold text-gray-900">
            Four steps to your next role
          </h2>
        </div>

        <div className="relative grid gap-8 md:grid-cols-4">
         
          <div className="absolute left-0 right-0 top-7 hidden h-px bg-gray-200 md:block" />

          {STEPS.map(({ icon: Icon, step, title, description }) => (
            <div key={step} className="relative">
              <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-200">
                <Icon size={22} />
              </div>

              <span className="mt-4 block text-xs font-bold tracking-widest text-blue-600">
                STEP {step}
              </span>
              <h3 className="mt-1 text-lg font-semibold text-gray-900">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;