// src/components/ProjectCard.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_PROJECTS_BY_ORG } from "../graphql/queries";
import type { Project } from "../types/project";

const ProjectCard = () => {
  const { organizationId } = useParams();
  const { data: projectData } = useQuery(GET_PROJECTS_BY_ORG, {
    variables: { organizationId: organizationId },
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">Project Name</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projectData.projects.map((project: Project) => (
            <tr key={project.id} className="text-center">
              <td className="px-4 py-2 border">{project.name}</td>
              <td className="px-4 py-2 border">{project.status ?? "N/A"}</td>
              <td className="px-4 py-2 border">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  onClick={() =>
                    navigate(`/projects/${project.id}`, {
                      state: { organizationId },
                    })
                  }
                >
                  Project Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectCard;
