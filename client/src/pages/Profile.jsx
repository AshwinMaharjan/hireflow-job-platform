import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import {
  User,
  Mail,
  ShieldCheck,
  X,
  Plus,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
} from "lucide-react";

const ROLE_STYLES = {
  recruiter: "bg-purple-100 text-purple-700",
  candidate: "bg-primary-100 text-primary-700",
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", skills: [] });
  const [skillInput, setSkillInput] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isRecruiter = user?.role === "recruiter";

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await api.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data);
      setFormData({
        name: res.data.name || "",
        skills: Array.isArray(res.data.skills) ? res.data.skills : [],
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


  
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  const isDirty = useMemo(() => {
    if (!user) return false;
    const originalSkills = Array.isArray(user.skills) ? user.skills : [];
    
    
    const skillsChanged =
      user.role !== "recruiter" &&
      (formData.skills.length !== originalSkills.length ||
        formData.skills.some((s, i) => s !== originalSkills[i]));

    return formData.name !== (user.name || "") || skillsChanged;
  }, [formData, user]);

  const handleNameChange = (e) => {
    setFormData((f) => ({ ...f, name: e.target.value }));
  };

  const addSkill = () => {
    const value = skillInput.trim();
    if (!value) return;
    if (formData.skills.some((s) => s.toLowerCase() === value.toLowerCase())) {
      setSkillInput("");
      return; // no duplicates
    }
    setFormData((f) => ({ ...f, skills: [...f.skills, value] }));
    setSkillInput("");
  };

  const removeSkill = (skill) => {
    setFormData((f) => ({ ...f, skills: f.skills.filter((s) => s !== skill) }));
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    } else if (
      e.key === "Backspace" &&
      !skillInput &&
      formData.skills.length > 0
    ) {
     
      
      removeSkill(formData.skills[formData.skills.length - 1]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Name can't be empty.");
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");

      const payload = {
        name: formData.name.trim(),
       
        
        ...(!isRecruiter && { skills: formData.skills }),
      };

      const res = await api.put("/users/me", payload, {
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

  const nameInitial = (user?.name || user?.email || "?")
    .charAt(0)
    .toUpperCase();

    

    

  if (loading) {
    return (
      <div className="mx-auto mt-10 max-w-xl animate-pulse px-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gray-200" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-1/2 rounded bg-gray-200" />
            <div className="h-3.5 w-1/3 rounded bg-gray-200" />
          </div>
        </div>
        <div className="mt-8 space-y-4">
          <div className="h-11 rounded-lg bg-gray-200" />
          <div className="h-11 rounded-lg bg-gray-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-10">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-2xl font-bold text-white shadow-lg">
          {nameInitial}
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold text-gray-900">
            {user?.name || "Your Profile"}
          </h1>
          {user?.role && (
            <span
              className={`mt-1 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                ROLE_STYLES[user.role] || "bg-gray-100 text-gray-700"
              }`}
            >
              <ShieldCheck size={12} />
              {user.role}
            </span>
          )}
        </div>
      </div>

      {/* Feedback banners */}
      {message && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700">
          <CheckCircle2 size={18} className="shrink-0" />
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle size={18} className="shrink-0" />
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        {/* Read-only account info */}
        <div className="mb-6 flex items-center gap-2 rounded-lg bg-gray-50 px-3.5 py-3 text-sm text-gray-500">
          <Mail size={16} />
          {user?.email}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <div className="relative">
              <User
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={handleNameChange}
                required
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-11 pr-4 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30"
              />
            </div>
          </div>


          {!isRecruiter && (
            <div>
              <label
                htmlFor="skills"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Skills
              </label>

              <div className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-300 p-2.5 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/30">
                {formData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 py-1 pl-3 pr-1.5 text-sm font-medium text-primary-700"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      aria-label={`Remove ${skill}`}
                      className="rounded-full p-0.5 transition hover:bg-primary-200"
                    >
                      <X size={13} />
                    </button>
                  </span>
                ))}

                <input
                  id="skills"
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  onBlur={addSkill}
                  placeholder={
                    formData.skills.length === 0
                      ? "e.g. React, Node.js, MongoDB"
                      : "Add another..."
                  }
                  className="min-w-[8rem] flex-1 border-none p-1 text-sm outline-none"
                />
              </div>
              <p className="mt-1.5 text-xs text-gray-400">
                Press Enter or comma to add a skill
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={saving || !isDirty}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-blue-700 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-blue-300 disabled:opacity-100"
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Changes
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;