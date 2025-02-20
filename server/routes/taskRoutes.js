const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

// Create a new task
router.post("/", async (req, res) => {
  try {
    const { title, description, status = "todo", projectId } = req.body; // Default status to "todo"
    
    if (!title || !projectId) {
      return res.status(400).json({ message: "Title and projectId are required" });
    }

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

// Update task status
router.patch("/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Task status is required" });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { status },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error });
  }
});

// Delete a task
router.delete("/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    
    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
});

module.exports = router;
