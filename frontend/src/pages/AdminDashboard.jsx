import { useEffect, useState } from "react";
import API from "../../utils/api";

export default function AdminDashboard() {
  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    try {
      const res = await API.get("/api/admin/projects");
      setProjects(res.data);
    } catch (err) {
      console.error("Admin project load failed");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/admin/projects/${id}/status`, { status });
      fetchProjects();
    } catch {
      alert("Failed to update status");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* ✅ Title */}
      <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-10">
        Admin Dashboard 👑
      </h1>

      {/* ✅ Projects Grid */}
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">
            No projects found
          </p>
        ) : (
          projects.map((project) => (
            <div
              key={project._id}
              className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-white"
            >
              {/* Title */}
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {project.title}
              </h3>

              {/* Description */}
              <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">
                {project.description}
              </p>

              {/* Owner */}
              <p className="text-sm text-gray-600 mb-3">
                <span className="font-semibold">Owner:</span>{" "}
                {project.owner?.name}
              </p>

              {/* Status Badge */}
              <div className="mb-4">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full
                    ${
                      project.status === "approved"
                        ? "bg-green-200 text-green-800"
                        : project.status === "rejected"
                        ? "bg-red-200 text-red-800"
                        : "bg-orange-200 text-orange-800"
                    }`}
                >
                  {project.status.charAt(0).toUpperCase() +
                    project.status.slice(1)}
                </span>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() =>
                    updateStatus(project._id, "approved")
                  }
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 rounded-xl shadow hover:opacity-90 transition"
                >
                  Approve
                </button>

                <button
                  onClick={() =>
                    updateStatus(project._id, "rejected")
                  }
                  className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 rounded-xl shadow hover:opacity-90 transition"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
