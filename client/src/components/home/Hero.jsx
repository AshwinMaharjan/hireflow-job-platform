import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroImage from "../../images/hero-image2.png";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="bg-[#FAFAF9]">
      <div className="mx-auto grid max-w-7xl gap-0 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
        
        <div className="flex flex-col justify-center px-5 py-20 lg:py-28 lg:pr-16">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#14171F]/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#14171F]/70">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F5A623]" />
            200+ roles opened this week
          </span>

          <h1 className="mt-6 text-[2.75rem] font-bold leading-[1.05] tracking-tight text-[#14171F] sm:text-5xl lg:text-[3.5rem]">
            Find work that
            <span className="block text-[#2554F5]">actually fits.</span>
          </h1>

          <p className="mt-5 max-w-md text-lg leading-7 text-[#14171F]/60">
            HireFlow matches you with teams that are hiring right now. Browse
            open roles by title, skill, or city, and apply in minutes.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2554F5] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#1e44d1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2554F5] focus-visible:ring-offset-2"
            >
              Login
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate("/register")}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#14171F]/15 px-6 py-3.5 text-sm font-semibold text-[#14171F] transition hover:border-[#14171F]/30 hover:bg-[#14171F]/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14171F]/30 focus-visible:ring-offset-2"
            >
              Create Free Account
            </button>
          </div>
        </div>

        {/* Right column: hero image */}
        <div className="relative flex items-center justify-center">
          <img
            src={heroImage}
            alt="Hero Image"
            className="w-[200%] max-w-none object-contain -ml-120 -mt-10"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
