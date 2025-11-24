import { useEffect, useState } from "react";
import API from "../../utils/api";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [tech, setTech] = useState("");

  const fetchProjects = async () => {
    try {
      const res = await API.get(
        `/api/projects?search=${search}&tech=${tech}`
      );
      setProjects(res.data);
    } catch (err) {
      console.error("Failed to load projects");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">
        Student Projects
      </h1>

      {/* Search + Filters */}
      <div className="max-w-4xl mx-auto flex gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by title..."
          className="flex-1 border p-2 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          type="text"
          placeholder="Filter by tech (React, Node...)"
          className="flex-1 border p-2 rounded"
          value={tech}
          onChange={(e) => setTech(e.target.value)}
        />

        <button
          onClick={fetchProjects}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {/* Project Cards */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project._id}
            className="bg-white p-4 rounded-xl shadow"
          >
            <h2 className="font-semibold text-lg">
              {project.title}
            </h2>
            <p className="text-gray-600 mt-1">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mt-3">
              {project.techStack?.map((tech, i) => (
                <span
                  key={i}
                  className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded"
                >
                  {tech}
                </span>
              ))}
            </div>

            <p className="text-sm mt-3 text-gray-500">
              By: {project.owner?.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
