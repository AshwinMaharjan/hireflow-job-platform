import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function CTABanner() {
  const navigate = useNavigate();

  return (
    <section className="mx-auto max-w-7xl px-5 pb-16">
      <div className="rounded-3xl border border-blue-100 bg-white px-8 py-14 shadow-lg sm:px-14">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-8 text-center lg:flex-row lg:text-left">
          {/* Left */}
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
             Start Your Journey
            </span>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Ready to launch your career?
            </h2>

            <p className="mt-4 text-lg leading-8 text-gray-600">
              Create a free account to discover jobs that match your skills,
              connect with top employers, and take the next step toward your
              dream career.
            </p>
          </div>

          {/* Right */}
          <div className="flex flex-shrink-0">
            <button
              onClick={() => navigate("/register")}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg"
            >
              Create Free Account
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTABanner;