const express = require("express");
const Project = require("../models/Projects");
const User = require("../models/User");
const { auth, adminOnly } = require("../middleware/auth");

const router = express.Router();

// ✅ Admin test route
router.get("/test", (req, res) => {
  res.json({ message: "✅ Admin routes working" });
});

/**
 * @route   GET /api/admin/projects
 * @desc    Get all projects (admin only)
 */
router.get("/projects", auth, adminOnly, async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (err) {
    console.error("Get all projects error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   PUT /api/admin/projects/:id/status
 * @desc    Approve or reject project
 */
router.put("/projects/:id/status", auth, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({
      message: `Project ${status} successfully`,
      project,
    });
  } catch (err) {
    console.error("Update project status error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   GET /api/admin/users
 * @desc    Get all users (no passwords)
 */
router.get("/users", auth, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error("Get users error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ✅ NEW: Simple analytics
 * @route   GET /api/admin/analytics
 * @desc    Get basic stats for dashboard
 */
router.get("/analytics", auth, adminOnly, async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    const approved = await Project.countDocuments({ status: "approved" });
    const pending = await Project.countDocuments({ status: "pending" });
    const rejected = await Project.countDocuments({ status: "rejected" });

    const totalUsers = await User.countDocuments();

    res.json({
      totalProjects,
      approved,
      pending,
      rejected,
      totalUsers,
    });
  } catch (err) {
    console.error("Analytics error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
