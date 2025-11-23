const express = require("express");
const Project = require("../models/Projects");
const { auth } = require("../middleware/auth");

const router = express.Router();

/**
 * @route   GET /api/analytics/summary
 * @desc    Get project analytics summary
 */
router.get("/summary", auth, async (req, res) => {
  try {
    const total = await Project.countDocuments({ owner: req.user.id });
    const approved = await Project.countDocuments({
      owner: req.user.id,
      status: "approved",
    });
    const pending = await Project.countDocuments({
      owner: req.user.id,
      status: "pending",
    });
    const rejected = await Project.countDocuments({
      owner: req.user.id,
      status: "rejected",
    });

    res.json({
      total,
      approved,
      pending,
      rejected,
    });
  } catch (err) {
    console.error("Analytics error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
