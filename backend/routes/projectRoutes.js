const express = require("express");
const Project = require("../models/Projects");
const { auth } = require("../middleware/auth");

const router = express.Router();

/**
 * @route   POST /api/projects
 * @desc    Create new project (User)
 */
router.post("/", auth, async (req, res) => {
  try {
    const {
      title,
      description,
      techStack,
      category,
      githubLink,
      demoLink,
      thumbnail,
    } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    const newProject = await Project.create({
      title,
      description,
      techStack,
      category,
      githubLink,
      demoLink,
      thumbnail,
      owner: req.user.id,
      status: "pending",
    });

    res.status(201).json(newProject);
  } catch (err) {
    console.error("Create project error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   GET /api/projects/me
 * @desc    Get logged-in user's projects
 */
router.get("/me", auth, async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user.id })
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (err) {
    console.error("My projects error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   GET /api/projects
 * @desc    Public - Search & filter projects
 */
router.get("/", async (req, res) => {
  try {
    const { search, tech, status } = req.query;

    let filter = {};

    // Default: show only approved projects
    if (status) {
      filter.status = status;
    } else {
      filter.status = "approved";
    }

    // Search by title
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    // Filter by tech stack
    if (tech) {
      filter.techStack = { $in: [tech] };
    }

    const projects = await Project.find(filter)
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (err) {
    console.error("Search projects error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   PUT /api/projects/:id
 * @desc    Update project (Only owner)
 */
router.put("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("Update project error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   DELETE /api/projects/:id
 * @desc    Delete project (Only owner)
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await project.deleteOne();

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error("Delete project error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
