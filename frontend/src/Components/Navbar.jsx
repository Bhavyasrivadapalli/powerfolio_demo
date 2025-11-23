import { Link, useNavigate } from "react-router-dom";
import { User } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();

  let user = null;
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      user = JSON.parse(storedUser);
    }
  } catch (err) {
    console.error("Invalid user in localStorage");
  }

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const gradientText =
    "bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent";

  const gradientButton =
    "bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1.5 rounded-lg shadow hover:opacity-90 transition";

  return (
    <nav className="bg-white shadow-md px-8 py-4 flex items-center justify-between">

      {/* 🔵 Left - Logo */}
      <Link
        to="/"
        className={`text-2xl font-bold tracking-wide ${gradientText}`}
      >
        PowerFolio
      </Link>

      {/* ⚡ Center - Navigation */}
      {user && (
        <div className="flex gap-8 items-center text-sm font-semibold">
          {user.role === "admin" ? (
            <>
              <Link to="/admin" className={gradientText}>
                Dashboard
              </Link>

              <Link to="/admin/analytics" className={gradientText}>
                Analytics
              </Link>

              <Link to="/admin/users" className={gradientText}>
                Users
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className={gradientText}>
                Dashboard
              </Link>

              <Link to="/analytics" className={gradientText}>
                Analytics
              </Link>

              <Link to="/add-project" className={gradientText}>
                Add Project
              </Link>
            </>
          )}
        </div>
      )}

      {/* 🧑 Right - Profile */}
      <div className="flex items-center gap-4 text-sm font-medium">
        {!user ? (
          <>
            <Link to="/login" className={gradientText}>
              Login
            </Link>
            <Link to="/register" className={gradientText}>
              Register
            </Link>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 font-semibold">
              <User size={18} className="text-indigo-600" />
              <span className={gradientText}>{user.name}</span>
            </div>

            <button onClick={logout} className={gradientButton}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
