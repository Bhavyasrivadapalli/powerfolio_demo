import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";

export default function AddProject() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    techStack: "",
    githubLink: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        techStack: form.techStack.split(","),
      };

      await API.post("/projects", payload);
      navigate("/dashboard");
    } catch (err) {
      alert("Failed to add project");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8">
        Add New Project
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-md space-y-5"
      >
        <input
          type="text"
          name="title"
          placeholder="Project Title"
          className="w-full border p-3 rounded-lg"
          value={form.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Project Description"
          className="w-full border p-3 rounded-lg"
          rows="4"
          value={form.description}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="techStack"
          placeholder="Tech Stack (comma separated)"
          className="w-full border p-3 rounded-lg"
          value={form.techStack}
          onChange={handleChange}
        />

        <input
          type="text"
          name="githubLink"
          placeholder="GitHub Link"
          className="w-full border p-3 rounded-lg"
          value={form.githubLink}
          onChange={handleChange}
        />

        <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-lg font-semibold hover:opacity-90">
          Add Project
        </button>
      </form>
    </div>
  );
}
