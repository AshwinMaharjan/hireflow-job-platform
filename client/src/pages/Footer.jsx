import { Link } from "react-router-dom";
import { BriefcaseBusiness, Heart } from "lucide-react";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-center md:flex-row md:px-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-bold text-gray-900"
        >
          <BriefcaseBusiness className="h-6 w-6 text-blue-600" />
          <span>HireFlow</span>
        </Link>

    
        {/* Copyright */}
        <p className="flex items-center gap-1 text-sm text-gray-500">
          © {year} HireFlow • Ashwin Maharjan
          
        </p>
      </div>
    </footer>
  );
}

export default Footer;