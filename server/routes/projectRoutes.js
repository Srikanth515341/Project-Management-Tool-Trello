const express = require("express");
const Project = require("../models/Project");

const router = express.Router();

// Create a new project
router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;
    const newProject = new Project({ name, description });
    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ message: "Error creating project", error });
  }
});

// Get all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects", error });
  }
});

module.exports = router;
