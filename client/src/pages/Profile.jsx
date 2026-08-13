import { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", skills: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data);
      setFormData({
        name: res.data.name || "",
        skills: Array.isArray(res.data.skills) ? res.data.skills.join(", ") : "",
      });
    } catch (err) {
      console.error(err);
      setError("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");

      const payload = {
        name: formData.name,
        skills: formData.skills
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s.length > 0),
      };

      const res = await axios.put("http://localhost:5000/api/users/me", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data.user);
      setMessage("Profile updated successfully.");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6">Loading profile...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>

      {message && <p className="text-green-600 mb-3">{message}</p>}
      {error && <p className="text-red-600 mb-3">{error}</p>}

      <div className="mb-4 text-sm text-gray-500">
        <p>Email: {user?.email}</p>
        <p>Role: {user?.role}</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border rounded p-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Skills (comma-separated)
          </label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="e.g. React, Node.js, MongoDB"
            className="border rounded p-2 w-full"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded w-fit"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default Profile;