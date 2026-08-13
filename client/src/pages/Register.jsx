import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await api.post("/auth/register", formData);

      alert("Registration Successful!");

      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-center mb-2">
          Create Account
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Register for HireFlow
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block mb-2 font-medium">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="Enter password"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Role
            </label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            >
              <option value="candidate">Candidate</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default Register;