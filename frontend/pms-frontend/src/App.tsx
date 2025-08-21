import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import Comments from "./pages/Comments";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/projects/:organizationId" element={<Projects />} />
      <Route path="/tasks/:projectId" element={<Tasks />} />
      <Route path="/comments/:taskId" element={<Comments />} />
    </Routes>
  );
}

export default App;
