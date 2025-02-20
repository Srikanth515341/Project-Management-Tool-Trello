import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");

  // Fetch Projects
  useEffect(() => {
    axios.get("http://localhost:5000/api/projects")
      .then(response => setProjects(response.data))
      .catch(error => console.error("Error fetching projects:", error));
  }, []);

  // Fetch Tasks for Selected Project
  useEffect(() => {
    if (selectedProject) {
      axios.get(`http://localhost:5000/api/tasks/${selectedProject._id}`)
        .then(response => setTasks(response.data))
        .catch(error => console.error("Error fetching tasks:", error));
    }
  }, [selectedProject]);

  // Create Project
  const handleCreateProject = () => {
    axios.post("http://localhost:5000/api/projects", { name: projectName, description })
      .then(response => {
        setProjects([...projects, response.data]);
        setProjectName("");
        setDescription("");
      })
      .catch(error => console.error("Error creating project:", error));
  };

  // Add Task
  const handleAddTask = () => {
    if (!selectedProject) return alert("Select a project first!");
    axios.post("http://localhost:5000/api/tasks", {
      title: taskTitle,
      description: taskDescription,
      status: "todo",
      projectId: selectedProject._id
    }).then(response => {
      setTasks([...tasks, response.data]);
      setTaskTitle("");
      setTaskDescription("");
    }).catch(error => console.error("Error adding task:", error));
  };

  // Delete Task
  const handleDeleteTask = (taskId) => {
    axios.delete(`http://localhost:5000/api/tasks/${taskId}`)
      .then(() => {
        setTasks(tasks.filter(task => task._id !== taskId));
      })
      .catch(error => console.error("Error deleting task:", error));
  };

  // Update Task Status
  const handleUpdateTaskStatus = (taskId, newStatus) => {
    axios.patch(`http://localhost:5000/api/tasks/${taskId}`, { status: newStatus })
      .then(response => {
        setTasks(tasks.map(task => task._id === taskId ? response.data : task));
      })
      .catch(error => console.error("Error updating task:", error));
  };

  return (
    <div className="container">
      <h1>Project Management Tool</h1>

      {/* Project Creation */}
      <div className="form-container">
        <input
          type="text"
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={handleCreateProject}>Create Project</button>
      </div>

      {/* Project Selection */}
      <h2>Projects</h2>
      {projects.map(project => (
        <div
          key={project._id}
          className={`project-item ${selectedProject?._id === project._id ? "selected" : ""}`}
          onClick={() => setSelectedProject(project)}
        >
          <strong>{project.name}</strong> - {project.description}
        </div>
      ))}

      {/* Task Board */}
      {selectedProject && (
        <>
          <h2>Tasks for {selectedProject.name}</h2>
          <div className="form-container">
            <input
              type="text"
              placeholder="Task Title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Task Description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
            />
            <button onClick={handleAddTask}>Add Task</button>
          </div>

          {/* Task Board Columns */}
          <div className="task-board">
            <div className="task-column">
              <h3>To-Do</h3>
              {tasks.filter(task => task.status === "todo").map(task => (
                <div key={task._id} className="task-card">
                  <span>{task.title} - {task.description}</span>
                  <select value={task.status} onChange={(e) => handleUpdateTaskStatus(task._id, e.target.value)}>
                    <option value="todo">To-Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                  <button className="delete-button" onClick={() => handleDeleteTask(task._id)}>Delete</button>
                </div>
              ))}
            </div>

            <div className="task-column">
              <h3>In Progress</h3>
              {tasks.filter(task => task.status === "in-progress").map(task => (
                <div key={task._id} className="task-card">
                  <span>{task.title} - {task.description}</span>
                  <select value={task.status} onChange={(e) => handleUpdateTaskStatus(task._id, e.target.value)}>
                    <option value="todo">To-Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                  <button className="delete-button" onClick={() => handleDeleteTask(task._id)}>Delete</button>
                </div>
              ))}
            </div>

            <div className="task-column">
              <h3>Done</h3>
              {tasks.filter(task => task.status === "done").map(task => (
                <div key={task._id} className="task-card">
                  <span>{task.title} - {task.description}</span>
                  <select value={task.status} onChange={(e) => handleUpdateTaskStatus(task._id, e.target.value)}>
                    <option value="todo">To-Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                  <button className="delete-button" onClick={() => handleDeleteTask(task._id)}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
