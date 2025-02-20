import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Fetch all projects
export const fetchProjects = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/projects`);
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};

// Create a new project
export const createProject = async (projectData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/projects`, projectData);
    return response.data;
  } catch (error) {
    console.error("Error creating project:", error);
    return null;
  }
};

// Fetch tasks for a specific project
export const fetchTasks = async (projectId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tasks/${projectId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};

// Create a new task
export const createTask = async (taskData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/tasks`, taskData);
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
    return null;
  }
};

// Update task status
export const updateTaskStatus = async (taskId, status) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/tasks/${taskId}`, { status });
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
    return null;
  }
};

// Delete a task
export const deleteTask = async (taskId) => {
  try {
    await axios.delete(`${API_BASE_URL}/tasks/${taskId}`);
    return true;
  } catch (error) {
    console.error("Error deleting task:", error);
    return false;
  }
};
