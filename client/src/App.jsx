import { useEffect, useState } from "react";
import { fetchProjects, createProject } from "./api";

function App() {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ name: "", description: "" });

  // Fetch projects when the app loads
  useEffect(() => {
    const getProjects = async () => {
      const data = await fetchProjects();
      setProjects(data);
    };
    getProjects();
  }, []);

  // Handle form submission to create a new project
  const handleSubmit = async (e) => {
    e.preventDefault();
    const createdProject = await createProject(newProject);
    if (createdProject) {
      setProjects([...projects, createdProject]); // Update UI
      setNewProject({ name: "", description: "" }); // Clear form
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Project Management Tool</h1>

      {/* Form to create a new project */}
      <form onSubmit={handleSubmit}>
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

      {/* Display projects */}
      <h2>Projects</h2>
      <ul>
        {projects.map((project) => (
          <li key={project._id}>
            <strong>{project.name}</strong> - {project.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
