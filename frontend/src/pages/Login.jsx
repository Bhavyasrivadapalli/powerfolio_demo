import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../utils/api";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#eef2ff] to-[#f8fafc] p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-10">

        {/* ✅ LEFT CARD - Instructions */}
        <div className="bg-white rounded-3xl p-8 shadow-xl flex flex-col justify-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Welcome Back 👋
          </h2>

          <ul className="space-y-4 text-gray-700 text-sm">
            <li>🔐 Login using your registered email and password.</li>
            <li>📁 Access and manage your submitted projects.</li>
            <li>⚡ Use your dashboard to edit or delete projects.</li>
            <li>👁 Use the eye icon to show or hide your password.</li>
            <li>
              📝 Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-indigo-600 font-semibold hover:underline"
              >
                Register here
              </Link>
            </li>
          </ul>
        </div>

        {/* ✅ RIGHT CARD - Login Form */}
        <div className="bg-white rounded-3xl p-8 shadow-xl flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email Field */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                onChange={handleChange}
                required
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                onChange={handleChange}
                required
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-red-500 text-sm text-center">
                {error}
              </p>
            )}

            {/* Button */}
            <button
              type="submit"
              className="w-full py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition-all shadow-md"
            >
              Login
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}
