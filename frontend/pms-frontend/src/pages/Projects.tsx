import { useQuery, useMutation } from "@apollo/client";
import React, { useState } from "react";
import type { Project } from "../types/project";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
  GET_PROJECTS_BY_ORG,
  CREATE_PROJECT,
  UPDATE_PROJECT,
  GET_PROJECT_STATUS_COUNTS,
} from "../graphql/queries";

const Projects = () => {
  const navigate = useNavigate();
  const { organizationId } = useParams();
  const parsedOrgId = organizationId ? parseInt(organizationId, 10) : null;
  const { data: projectData, refetch: refetchProjects } = useQuery(
    GET_PROJECTS_BY_ORG,
    {
      skip: parsedOrgId === null,
      variables: { organizationId: parsedOrgId },
    }
  );

  const { data: statusData, refetch: refetchStatusCounts } = useQuery(
    GET_PROJECT_STATUS_COUNTS,
    {
      variables: { organizationId: parsedOrgId },
      skip: parsedOrgId === null,
    }
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [createProject] = useMutation(CREATE_PROJECT);
  const [updateProject] = useMutation(UPDATE_PROJECT);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const addProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const description = (
      form.elements.namedItem("description") as HTMLTextAreaElement
    ).value;
    const dueDate = (form.elements.namedItem("dueDate") as HTMLInputElement)
      .value;
    const status = "active";
    const organizationId = parsedOrgId;

    try {
      await createProject({
        variables: {
          name,
          description,
          status,
          dueDate,
          organizationId,
        },
      });
      await Promise.all([refetchProjects(), refetchStatusCounts()]);
      setShowAddModal(false);
    } catch (err) {
      if (err instanceof Error) {
        console.error("Create failed:", err.message);
      } else {
        console.error("Create failed:", err);
      }
    }
  };

  const updateProjectHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const id = parseInt(
      (form.elements.namedItem("id") as HTMLInputElement).value,
      10
    );

    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const description = (
      form.elements.namedItem("description") as HTMLTextAreaElement
    ).value;
    const dueDate = (form.elements.namedItem("dueDate") as HTMLInputElement)
      .value;
    const status = (form.elements.namedItem("status") as HTMLSelectElement)
      .value;

    try {
      await updateProject({
        variables: {
          id,
          name,
          description,
          status,
          dueDate,
        },
      });
      await refetchStatusCounts();
      setShowUpdateModal(false);
    } catch (err) {
      if (err instanceof Error) {
        console.error("Update failed:", err.message);
      } else {
        console.error("Update failed:", err);
      }
    }
  };

  console.log(`Using organizationId: ${parsedOrgId} org : ${organizationId}`);
  console.log(projectData);

  return (
    <div className="overflow-auto h-full w-full p-4 rounded shadow">
      <div className="p-8">
        <button
          onClick={() => navigate(-1)}
          style={{
            backgroundColor: "#FFD66B",
          }}
          className="px-6 py-2 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 m-4"
        >
          ← BACK
        </button>
        <h1 className="m-6 text-2xl text-white md:text-4xl font-bold text-center">
          Organization Project Stats
        </h1>

        <h2 className="text-xl font-semibold mb-4 text-center text-white">
          Projects under the Organization {parsedOrgId}
        </h2>

        {statusData?.organizationProjectStatusCounts && (
          <div className="mb-6 px-4 text-white">
            <div className="flex justify-between text-sm mb-2">
              <span>
                Active: {statusData.organizationProjectStatusCounts.active}
              </span>
              <span>
                Completed:{" "}
                {statusData.organizationProjectStatusCounts.completed}
              </span>
              <span>
                Archived: {statusData.organizationProjectStatusCounts.archived}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 flex overflow-hidden">
              {["active", "completed", "archived"].map((key, i) => {
                const count = statusData.organizationProjectStatusCounts[key];
                const total =
                  statusData.organizationProjectStatusCounts.active +
                  statusData.organizationProjectStatusCounts.completed +
                  statusData.organizationProjectStatusCounts.archived;
                const width = total > 0 ? (count / total) * 100 : 0;
                const colors = ["#4DA8DA", "#FFD66B", "#F5F5F5"];
                return (
                  <div
                    key={key}
                    style={{
                      backgroundColor: colors[i],
                      width: `${width}%`,
                      height: "100%",
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}

        {projectData?.projects.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-gray-800  rounded-lg text-sm p-4">
              <thead>
                <tr>
                  <th className="px-4 py-2 ">Project Name</th>
                  <th className="px-4 py-2 ">Status</th>
                  <th className="px-4 py-2 ">Description</th>
                  <th className="px-4 py-2 ">Due Date</th>
                  <th className="px-4 py-2 ">Completed Tasks</th>
                  <th className="px-4 py-2 ">Task Count</th>
                  <th className="px-4 py-2 "></th>
                </tr>
              </thead>
              <tbody>
                {projectData.projects.map((project: Project) => (
                  <tr key={project.id} className="text-center">
                    <td className="px-4 py-2 border">{project.name}</td>
                    <td className="px-4 py-2 border">
                      {project.status ?? "N/A"}
                    </td>
                    <td className="px-4 py-2 border">
                      {project.description ?? "N/A"}
                    </td>
                    <td className="px-4 py-2 border">
                      {project.dueDate ?? "N/A"}
                    </td>
                    <td className="px-4 py-2 border">
                      {project.completedTasks ?? "N/A"}
                    </td>
                    <td className="px-4 py-2 border">
                      {project.taskCount ?? "N/A"}
                    </td>
                    <td className="px-4 py-2 ">
                      <button
                        style={{
                          backgroundColor: "#F5F5F5",
                        }}
                        className="px-3 py-1 mx-2 rounded hover:bg-purple-600"
                        onClick={() =>
                          navigate(`/tasks/${project.id}`, {
                            state: { organizationId: parsedOrgId },
                          })
                        }
                      >
                        View Tasks
                      </button>
                      {/* </td>
                    <td className="px-4 py-2 "> */}
                      <button
                        onClick={() => {
                          setShowUpdateModal(true);
                          setSelectedProject(project);
                        }}
                        style={{
                          backgroundColor: "#4DA8DA",
                        }}
                        className="text-white px-3 py-1 mx-2 rounded hover:bg-blue-700"
                      >
                        Update Project
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            + Add Project
          </button>
        </div>
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <h3 className="text-lg font-semibold mb-4">Add New Project</h3>
              <form onSubmit={addProject}>
                <input
                  name="name"
                  type="text"
                  placeholder="New Project Name"
                  className="w-full mb-2 p-2 border rounded"
                  required
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  className="w-full mb-2 p-2 border rounded"
                />
                <input
                  name="dueDate"
                  type="date"
                  className="w-full mb-2 p-2 border rounded"
                />
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                  Create
                </button>
              </form>
              <button
                onClick={() => setShowAddModal(false)}
                className="mt-4 text-sm text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {showUpdateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <h3 className="text-lg font-semibold mb-4">Update Project</h3>
              <form onSubmit={updateProjectHandler}>
                <input
                  name="id"
                  type="text"
                  value={selectedProject?.id ?? ""}
                  readOnly
                  className="w-full mb-2 p-2 border rounded bg-gray-100 text-gray-600"
                />
                <input
                  name="name"
                  type="text"
                  defaultValue={selectedProject?.name}
                  placeholder="New Project Name"
                  className="w-full mb-2 p-2 border rounded"
                />
                <textarea
                  name="description"
                  defaultValue={selectedProject?.description}
                  placeholder="New Description"
                  className="w-full mb-2 p-2 border rounded"
                />
                <input
                  name="dueDate"
                  type="date"
                  defaultValue={
                    selectedProject?.dueDate
                      ? selectedProject.dueDate.slice(0, 10)
                      : new Date().toISOString().slice(0, 10)
                  }
                  className="w-full mb-2 p-2 border rounded"
                />
                <select
                  name="status"
                  className="w-full mb-2 p-2 border rounded"
                  defaultValue={selectedProject?.status ?? "active"}
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Update
                </button>
              </form>
              <button
                onClick={() => setShowUpdateModal(false)}
                className="mt-4 text-sm text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
