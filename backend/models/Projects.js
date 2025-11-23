// backend/models/Project.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    techStack: {
      type: [String], // e.g. ["React", "Node", "MongoDB"]
      default: [],
    },
    category: {
      type: String, // e.g. "Web", "ML", "Mobile"
      default: 'General',
    },
    githubLink: String,
    demoLink: String,
    thumbnail: String, // optional: URL of image
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
