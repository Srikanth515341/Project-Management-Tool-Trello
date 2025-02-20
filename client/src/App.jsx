import { useEffect, useState } from "react";
import { fetchProjects, createProject, fetchTasks, createTask, updateTaskStatus, deleteTask } from "./api";

function App() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState({});
  const [newProject, setNewProject] = useState({ name: "", description: "" });
  const [newTask, setNewTask] = useState({ title: "", description: "", projectId: "" });

  // Fetch projects when the app loads
  useEffect(() => {
    const getProjects = async () => {
      const data = await fetchProjects();
      setProjects(data);
    };
    getProjects();
  }, []);

  // Fetch tasks when a project is loaded
  useEffect(() => {
    projects.forEach((project) => {
      fetchTasks(project._id).then((data) => {
        setTasks((prevTasks) => ({ ...prevTasks, [project._id]: data }));
      });
    });
  }, [projects]);

  // Handle form submission to create a new project
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    if (!newProject.name.trim()) return; // Prevent empty project
    const createdProject = await createProject(newProject);
    if (createdProject) {
      setProjects([...projects, createdProject]); // Update UI
      setNewProject({ name: "", description: "" }); // Clear form
    }
  };

  // Handle form submission to create a new task
  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim() || !newTask.projectId) return; // Prevent empty tasks

    const createdTask = await createTask(newTask);
    if (createdTask) {
      setTasks((prevTasks) => ({
        ...prevTasks,
        [newTask.projectId]: [...(prevTasks[newTask.projectId] || []), createdTask],
      }));
      setNewTask({ title: "", description: "", projectId: "" }); // Clear form
    }
  };

  // Handle updating task status
  const handleTaskStatusChange = async (taskId, status) => {
    if (!taskId) {
      console.error("Error: Task ID is missing!");
      return;
    }
    console.log("Updating Task ID:", taskId, "New Status:", status); // Debugging

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

  // Handle deleting a task
  const handleDeleteTask = async (taskId, projectId) => {
    if (!taskId) {
      console.error("Error: Task ID is missing!");
      return;
    }
    const success = await deleteTask(taskId);
    if (success) {
      setTasks((prevTasks) => ({
        ...prevTasks,
        [projectId]: prevTasks[projectId].filter((task) => task._id !== taskId),
      }));
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Project Management Tool</h1>

      {/* Form to create a new project */}
      <form onSubmit={handleProjectSubmit}>
        <input
          type="text"
          placeholder="Project Name"
          value={newProject.name}
          onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={newProject.description}
          onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
        />
        <button type="submit">Create Project</button>
      </form>

      {/* Display projects and tasks */}
      <h2>Projects</h2>
      {projects.map((project) => (
        <div key={project._id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
          <h3>{project.name}</h3>
          <p>{project.description}</p>

          {/* Form to add tasks */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleTaskSubmit(e);
            }}
          >
            <input
              type="text"
              placeholder="Task Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value, projectId: project._id })}
              required
            />
            <input
              type="text"
              placeholder="Task Description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value, projectId: project._id })}
            />
            <button type="submit">Add Task</button>
          </form>

          {/* Display tasks */}
          <h4>Tasks</h4>
          <ul>
            {(tasks[project._id] || []).map((task) => (
              <li key={task._id}>
                <strong>{task.title}</strong> - {task.description}  
                <select
                  value={task.status}
                  onChange={(e) => handleTaskStatusChange(task._id, e.target.value)}
                >
                  <option value="todo">To-Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
                <button onClick={() => handleDeleteTask(task._id, project._id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default App;
