import { useEffect, useState } from "react";
import { BriefcaseBusiness, Building2, MapPin, Users } from "lucide-react";
import api from "../../services/api";
import Hero from "./Hero";
import StatsBar from "./StatsBar";
import FeaturedJobs from "./FeaturedJobs";
import WhyHireFlow from "./WhyHireFlow";
import HowItWorks from "./HowItWorks";
import TopCompanies from "./TopCompanies";
import CTABanner from "./CTABanner";
import Footer from "./Footer";

function GuestHome() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/jobs");
      setJobs(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
  {
    label: "Active Jobs",
    value: "50",
    icon: BriefcaseBusiness,
    bg: "bg-[#EEF1F8]",
    cardBg: "bg-[#DCE2F0]/80",
    iconColor: "text-[#3E4E8C]",
  },
  {
    label: "Companies Hiring",
    value: "10",
    icon: Building2,
    bg: "bg-[#F3EEF5]",
    cardBg: "bg-[#E4D9EA]/80",
    iconColor: "text-[#6B4E7D]",
  },
  {
    label: "Remote Jobs",
    value: "20",
    icon: MapPin,
    bg: "bg-[#F6F0E6]",
    cardBg: "bg-[#ECDEC7]/80",
    iconColor: "text-[#8A6634]",
  },
  {
    label: "Candidates Hired",
    value: "500+",
    icon: Users,
    bg: "bg-[#EBF2EE]",
    cardBg: "bg-[#D3E4DA]/80",
    iconColor: "text-[#3D6B52]",
  },
];
  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />

      <div className="mx-auto max-w-7xl px-5">
        <StatsBar stats={stats} />
      </div>

      <FeaturedJobs jobs={jobs} loading={loading} />
      <WhyHireFlow />
      <HowItWorks />
      <CTABanner />
      <Footer />
    </div>
  );
}

export default GuestHome;