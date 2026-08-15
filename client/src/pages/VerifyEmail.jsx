import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  MailCheck,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

import Footer from "../components/home/Footer";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const hasVerified = useRef(false);

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (hasVerified.current) {
      return;
    }

    hasVerified.current = true;

    const verifyEmail = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/auth/verify-email/${token}`
        );

        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage(data.message);
        } else {
          setStatus("error");
          setMessage(data.message);
        }
      } catch (error) {
        console.error("Email verification error:", error);

        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <>
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-sm">
              <MailCheck className="h-5 w-5 text-white" />
            </div>

            <span className="text-2xl font-bold tracking-tight text-slate-900">
              Hire<span className="text-indigo-600">Flow</span>
            </span>
          </button>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          {/* VERIFYING */}
          {status === "verifying" && (
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50">
                <Loader2 className="h-9 w-9 animate-spin text-indigo-600" />
              </div>

              <h1 className="text-2xl font-bold text-slate-900">
                Verifying your email
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Please wait while we confirm your email address. This should
                only take a moment.
              </p>

              <div className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-indigo-600">
                <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-600" />
                Verifying your account...
              </div>
            </div>
          )}

          {/* SUCCESS */}
          {status === "success" && (
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
              </div>

              <h1 className="text-2xl font-bold text-slate-900">
                Email verified!
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                {message || "Your email address has been successfully verified."}
              </p>

              <div className="mt-6 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                Your HireFlow account is now ready to use.
              </div>

              <button
                onClick={() => navigate("/login")}
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Continue to Login
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* ERROR */}
          {status === "error" && (
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
                <XCircle className="h-10 w-10 text-red-500" />
              </div>

              <h1 className="text-2xl font-bold text-slate-900">
                Verification failed
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                {message || "We couldn't verify your email address."}
              </p>

              <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-left text-sm leading-5 text-red-700">
                The verification link may have expired or already been used.
                Please try registering again or request a new verification
                email.
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <button
                  onClick={() => navigate("/register")}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </button>

                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  Login
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        
      </div>
    </div>
    <Footer />

    </>
  );
};

export default VerifyEmail;