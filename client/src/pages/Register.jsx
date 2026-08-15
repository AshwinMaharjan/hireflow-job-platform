import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Briefcase,
  UserRound,
  Building2,
} from "lucide-react";
import Footer from "../components/home/Footer";
import toast, { Toaster } from "react-hot-toast";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({ name: false, email: false, password: false });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBlur = (field) => setTouched((t) => ({ ...t, [field]: true }));


  
  const nameError = useMemo(() => {
    if (!touched.name) return "";
    if (!formData.name.trim()) return "Full name is required";
    return "";
  }, [formData.name, touched.name]);

  const emailError = useMemo(() => {
    if (!touched.email) return "";
    if (!formData.email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return "Enter a valid email address";
    return "";
  }, [formData.email, touched.email]);

  const passwordError = useMemo(() => {
    if (!touched.password) return "";
    if (!formData.password) return "Password is required";
    if (formData.password.length < 6) return "Password must be at least 6 characters";
    return "";
  }, [formData.password, touched.password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({ name: true, email: true, password: true });

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      formData.password.length < 6
    ) {
      setError("Please fix the highlighted fields to continue.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.post("/auth/register", {
  ...formData,
  name: formData.name.trim(),
  email: formData.email.trim(),
});

toast.success("Registration successful! Please log in.");

setTimeout(() => {
  navigate("/login");
}, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "We couldn't create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="w-full rounded-2xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-200/50">
            {/* Logo & Badge */}
            <div className="mb-8 flex flex-col items-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-lg">
                <Briefcase className="h-8 w-8 text-white" />
              </div>

              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold tracking-wide text-blue-700">
                HireFlow
              </span>

              <h1 className="mt-5 text-center text-3xl font-bold text-gray-900">
                Create Your Account
              </h1>

              <p className="mt-2 max-w-xs text-center text-sm leading-6 text-gray-500">
                Join HireFlow to find your next role or start hiring great talent.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="mt-6 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700"
              >
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
              {/* Full Name */}
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Full name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    className={`w-full rounded-lg border py-3 pl-11 pr-4 text-sm outline-none transition focus:ring-2 focus:ring-blue-500/30 ${
                      nameError
                        ? "border-red-300 focus:border-red-400"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={() => handleBlur("name")}
                    aria-invalid={!!nameError}
                    aria-describedby={nameError ? "name-error" : undefined}
                  />
                </div>

                {nameError && (
                  <p id="name-error" className="mt-1.5 text-xs text-red-600">
                    {nameError}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Email
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className={`w-full rounded-lg border py-3 pl-11 pr-4 text-sm outline-none transition focus:ring-2 focus:ring-blue-500/30 ${
                      emailError
                        ? "border-red-300 focus:border-red-400"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={() => handleBlur("email")}
                    aria-invalid={!!emailError}
                    aria-describedby={emailError ? "email-error" : undefined}
                  />
                </div>

                {emailError && (
                  <p id="email-error" className="mt-1.5 text-xs text-red-600">
                    {emailError}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className={`w-full rounded-lg border py-3 pl-11 pr-11 text-sm outline-none transition focus:ring-2 focus:ring-blue-500/30 ${
                      passwordError
                        ? "border-red-300 focus:border-red-400"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={() => handleBlur("password")}
                    aria-invalid={!!passwordError}
                    aria-describedby={passwordError ? "password-error" : "password-hint"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {passwordError ? (
                  <p id="password-error" className="mt-1.5 text-xs text-red-600">
                    {passwordError}
                  </p>
                ) : (
                  <p id="password-hint" className="mt-1.5 text-xs text-gray-400">
                    At least 6 characters
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  I'm registering as
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "candidate", label: "Candidate", desc: "Looking for a job", icon: UserRound },
                    { value: "recruiter", label: "Recruiter", desc: "Hiring for a team", icon: Building2 },
                  ].map(({ value, label, desc, icon: Icon }) => {
                    const active = formData.role === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setFormData((f) => ({ ...f, role: value }))}
                        aria-pressed={active}
                        className={`flex flex-col items-start gap-1 rounded-lg border px-4 py-3 text-left transition ${
                          active
                            ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <Icon
                          size={18}
                          className={active ? "text-blue-600" : "text-gray-400"}
                        />
                        <span
                          className={`text-sm font-semibold ${
                            active ? "text-blue-700" : "text-gray-800"
                          }`}
                        >
                          {label}
                        </span>
                        <span className="text-xs text-gray-500">{desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    Create account
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-blue-600 hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Register;