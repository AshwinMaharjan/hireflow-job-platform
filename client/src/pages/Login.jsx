import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      login(res.data.user, res.data.token);

      if (res.data.user.role === "recruiter") {
        navigate("/recruiter/dashboard");
      } else {
        navigate("/candidate/dashboard");
      }

    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-center mb-2">
          Welcome Back
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Login to your HireFlow account
        </p>

        {error && (
          <div className="mb-4 rounded bg-red-100 text-red-700 p-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              className="w-full border rounded-lg px-4 py-3"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>

            <label className="block mb-2 font-medium">
              Password
            </label>

            <div className="flex">

              <input
                type={showPassword ? "text" : "password"}
                className="flex-1 border rounded-l-lg px-4 py-3"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="border border-l-0 px-4 rounded-r-lg"
              >
                {showPassword ? "Hide" : "Show"}
              </button>

            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default Login;