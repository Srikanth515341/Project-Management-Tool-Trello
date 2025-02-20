import { useEffect, useState } from "react";
import {
  fetchProjects,
  createProject,
  fetchTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
} from "./api";
import "./App.css";

function App() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState({});
  const [newProject, setNewProject] = useState({ name: "", description: "" });
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    projectId: "",
  });

  useEffect(() => {
    const getProjects = async () => {
      const data = await fetchProjects();
      setProjects(data);
    };
    getProjects();
  }, []);

  useEffect(() => {
    projects.forEach((project) => {
      fetchTasks(project._id).then((data) => {
        setTasks((prevTasks) => ({ ...prevTasks, [project._id]: data }));
      });
    });
  }, [projects]);

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    const createdProject = await createProject(newProject);
    if (createdProject) {
      setProjects([...projects, createdProject]);
      setNewProject({ name: "", description: "" });
    }
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    const createdTask = await createTask(newTask);
    if (createdTask) {
      setTasks({
        ...tasks,
        [newTask.projectId]: [...(tasks[newTask.projectId] || []), createdTask],
      });
      setNewTask({ title: "", description: "", projectId: "" });
    }
  };

  const handleTaskStatusChange = async (taskId, status) => {
    const updatedTask = await updateTaskStatus(taskId, status);
    if (updatedTask) {
      setTasks((prevTasks) =>
        Object.keys(prevTasks).reduce((acc, projectId) => {
          acc[projectId] = prevTasks[projectId].map((task) =>
            task._id === taskId ? updatedTask : task
          );
          return acc;
        }, {})
      );
    }
  };

  const handleDeleteTask = async (taskId, projectId) => {
    const success = await deleteTask(taskId);
    if (success) {
      setTasks((prevTasks) => ({
        ...prevTasks,
        [projectId]: prevTasks[projectId].filter((task) => task._id !== taskId),
      }));
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Project Management Tool</h1>

      <form className="project-form" onSubmit={handleProjectSubmit}>
        <input
          type="text"
          placeholder="Project Name"
          value={newProject.name}
          onChange={(e) =>
            setNewProject({ ...newProject, name: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={newProject.description}
          onChange={(e) =>
            setNewProject({ ...newProject, description: e.target.value })
          }
        />
        <button type="submit" className="btn-primary">Create Project</button>
      </form>

      <h2>Projects</h2>
      {projects.map((project) => (
        <div key={project._id} className="project-container">
          <h3>{project.name}</h3>
          <p>{project.description}</p>

          <form className="task-form" onSubmit={handleTaskSubmit}>
            <input
              type="text"
              placeholder="Task Title"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value, projectId: project._id })
              }
              required
            />
            <input
              type="text"
              placeholder="Task Description"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value, projectId: project._id })
              }
            />
            <button type="submit" className="btn-secondary">Add Task</button>
          </form>

          <h4>Tasks</h4>
          <ul className="task-list">
            {(tasks[project._id] || []).map((task) => (
              <li key={task._id} className="task-item">
                <strong>{task.title}</strong> - {task.description}
                <select
                  className="task-status"
                  value={task.status}
                  onChange={(e) => handleTaskStatusChange(task._id, e.target.value)}
                >
                  <option value="todo">To-Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
                <button
                  className="btn-delete"
                  onClick={() => handleDeleteTask(task._id, project._id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default App;
