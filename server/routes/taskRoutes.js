const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

// Create a new task
router.post("/", async (req, res) => {
  try {
    const { title, description, status, projectId } = req.body;
    const newTask = new Task({ title, description, status, projectId });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error });
  }
});

// Get all tasks for a project
router.get("/:projectId", async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectId });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
});

module.exports = router;
