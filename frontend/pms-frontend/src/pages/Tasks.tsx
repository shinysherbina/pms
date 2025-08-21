import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import React, { useState, useEffect } from "react";
import {
  GET_TASKS_BY_PROJECT,
  UPDATE_TASK,
  CREATE_TASK,
} from "../graphql/queries";
import type { Task } from "../types/task";

const Tasks = () => {
  const { projectId } = useParams();
  const { state } = useLocation();
  const organizationId = state?.organizationId;
  const navigate = useNavigate();
  const parsedProjectId = projectId ? parseInt(projectId, 10) : null;

  const { data, loading, error, refetch } = useQuery(GET_TASKS_BY_PROJECT, {
    variables: { projectId: parsedProjectId },
    skip: !parsedProjectId,
  });

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [updateTask] = useMutation(UPDATE_TASK);
  const [showAddModal, setShowAddModal] = useState(false);
  const [createTask] = useMutation(CREATE_TASK);

  const addTaskHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const title = (form.elements.namedItem("title") as HTMLInputElement).value;
    const description = (
      form.elements.namedItem("description") as HTMLTextAreaElement
    ).value;
    const assigneeEmail = (
      form.elements.namedItem("assigneeEmail") as HTMLInputElement
    ).value;
    const status = (form.elements.namedItem("status") as HTMLSelectElement)
      .value;

    try {
      await createTask({
        variables: {
          projectId: parsedProjectId,
          title,
          description,
          assigneeEmail,
          status,
        },
      });
      await refetch();
      setShowAddModal(false);
    } catch (err) {
      if (err instanceof Error) {
        console.error("Create failed:", err.message);
      } else {
        console.error("Create failed:", err);
      }
    }
  };

  const updateTaskHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const id = parseInt(
      (form.elements.namedItem("id") as HTMLInputElement).value,
      10
    );
    const status = (form.elements.namedItem("status") as HTMLSelectElement)
      .value;
    const assigneeEmail = (
      form.elements.namedItem("assigneeEmail") as HTMLSelectElement
    ).value;

    try {
      await updateTask({
        variables: {
          id,
          status,
          assigneeEmail,
        },
      });
      await refetch();
      setShowUpdateModal(false);
      setSelectedTask(null);
    } catch (err) {
      if (err instanceof Error) {
        console.error("Update failed:", err.message);
      } else {
        console.error("Update failed:", err);
      }
    }
  };

  return (
    <div className="overflow-auto h-full w-full p-4 rounded shadow">
      <button
        onClick={() => navigate(-1)}
        style={{
          backgroundColor: "#FFD66B",
        }}
        className="px-6 py-2 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 m-4"
      >
        ← Back
      </button>

      <h1 className="m-6 text-2xl text-white md:text-4xl font-bold text-center">
        Task List
      </h1>
      <div className="mb-4 ">
        <h2 className="text-xl font-semibold mb-2  text-white">
          Organization ID: {organizationId}
        </h2>
        <h2 className="text-xl font-semibold mb-2  text-white">
          Project ID: {parsedProjectId}
        </h2>
      </div>

      {!parsedProjectId && (
        <p className="text-red-500">Invalid project ID in route.</p>
      )}

      {loading && <p>Loading tasks...</p>}
      {error && (
        <p className="text-red-500">Failed to load tasks: {error.message}</p>
      )}

      {!loading && !error && data?.tasks?.length === 0 && (
        <p className="text-gray-500">No tasks found for this project.</p>
      )}

      {!loading && !error && data?.tasks?.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-gray-800  rounded-lg text-sm p-4">
            <thead>
              <tr>
                <th className="px-4 py-2 ">ID</th>
                <th className="px-4 py-2 ">Title</th>
                <th className="px-4 py-2 ">Status</th>
                <th className="px-4 py-2 ">Assignee Email</th>
                <th className="px-4 py-2 "></th>
              </tr>
            </thead>
            <tbody>
              {data.tasks.map((task: Task) => (
                <tr key={task.id} className="text-center">
                  <td className="px-4 py-2 border">{task.id}</td>
                  <td className="px-4 py-2 border">{task.title}</td>
                  <td className="px-4 py-2 border">{task.status}</td>
                  <td className="px-4 py-2 border">
                    {task.assigneeEmail ?? "N/A"}
                  </td>
                  <td className="px-4 py-2  space-x-2">
                    <button
                      style={{
                        backgroundColor: "#F5F5F5",
                      }}
                      className="px-3 py-1 rounded hover:bg-purple-600"
                      onClick={() => navigate(`/comments/${task.id}`)}
                    >
                      View Comments
                    </button>
                    <button
                      style={{
                        backgroundColor: "#4DA8DA",
                      }}
                      className="text-white px-3 py-1 rounded hover:bg-blue-700"
                      onClick={() => {
                        setSelectedTask(task);
                        setShowUpdateModal(true);
                      }}
                    >
                      Update Task
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-8 flex gap-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              + Add Task
            </button>
          </div>
        </div>
      )}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Add New Task</h3>
            <form onSubmit={addTaskHandler}>
              <input
                name="title"
                type="text"
                placeholder="Task Title"
                className="w-full mb-2 p-2 border rounded"
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                className="w-full mb-2 p-2 border rounded"
              />
              <input
                name="assigneeEmail"
                type="email"
                placeholder="Assignee Email"
                className="w-full mb-2 p-2 border rounded"
                required
              />
              <select
                name="status"
                className="w-full mb-2 p-2 border rounded"
                defaultValue="todo"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
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

      {showUpdateModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Update Task Status</h3>
            <form onSubmit={updateTaskHandler}>
              <input
                name="id"
                type="text"
                value={selectedTask.id}
                readOnly
                className="w-full mb-2 p-2 border rounded bg-gray-100 text-gray-600"
              />
              <select
                name="status"
                className="w-full mb-2 p-2 border rounded"
                defaultValue={selectedTask.status}
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <input
                name="assigneeEmail"
                type="text"
                defaultValue={selectedTask.assigneeEmail || ""}
                className="w-full mb-2 p-2 border rounded"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Update
              </button>
            </form>
            <button
              onClick={() => {
                setShowUpdateModal(false);
                setSelectedTask(null);
              }}
              className="mt-4 text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
