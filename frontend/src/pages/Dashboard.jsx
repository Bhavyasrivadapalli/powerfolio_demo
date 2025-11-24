import { useEffect, useState } from "react";
import API from "../../utils/api";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  let user = null;
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch (err) {}

  const fetchProjects = async () => {
    try {
      const res = await API.get("/api/projects/me");
      setProjects(res.data);
    } catch (err) {
      console.error("Failed to load projects");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((project) => {
    const matchSearch =
      project.title.toLowerCase().includes(search.toLowerCase()) ||
      project.description.toLowerCase().includes(search.toLowerCase()) ||
      project.techStack?.join(",").toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      filter === "all" || project.status === filter;

    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* ✅ Dynamic Title */}
      <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8">
        {user?.name ? `${user.name}'s Dashboard` : "User Dashboard"}
      </h1>

      {/* 🔍 Search + Filter */}
      <div className="max-w-4xl mx-auto mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search projects..."
          className="flex-1 border p-2 rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded-lg"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* ✅ Premium Project Cards */}
      <div className="max-w-6xl mx-auto mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">
            No projects found
          </p>
        ) : (
          filteredProjects.map((project) => (
            <div
              key={project._id}
              className="bg-white/80 backdrop-blur-xl border border-gray-100 p-6 rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              {/* Gradient top bar */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

              {/* Title */}
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {project.title}
              </h2>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                {project.description}
              </p>

              {/* Status Badge */}
              <div className="mb-4">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full
                    ${
                      project.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : project.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                >
                  {project.status.charAt(0).toUpperCase() +
                    project.status.slice(1)}
                </span>
              </div>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 mt-2">
                {project.techStack?.map((tech, i) => (
                  <span
                    key={i}
                    className="text-xs font-medium bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 px-3 py-1 rounded-full border border-indigo-100 hover:shadow-sm transition"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
