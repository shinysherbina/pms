import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_COMMENTS_BY_TASK,
  CREATE_COMMENT,
  UPDATE_COMMENT,
} from "../graphql/queries";
import React, { useState } from "react";
import type { Comment, Task } from "../types/task";

const Comments = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const parsedTaskId = taskId ? parseInt(taskId, 10) : null;

  const { data, refetch } = useQuery(GET_COMMENTS_BY_TASK, {
    variables: { taskId: parsedTaskId },
    skip: !parsedTaskId,
  });

  console.log("Comments data:", data);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [createComment] = useMutation(CREATE_COMMENT);
  const [updateComment] = useMutation(UPDATE_COMMENT);

  const task: Task | undefined = data?.task;

  const addCommentHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const content = (form.elements.namedItem("content") as HTMLTextAreaElement)
      .value;
    const authorEmail = (
      form.elements.namedItem("authorEmail") as HTMLInputElement
    ).value;

    try {
      await createComment({
        variables: {
          taskId: parsedTaskId,
          content,
          authorEmail,
        },
      });
      await refetch();
      form.reset();
    } catch (err) {
      console.error("Create failed:", err);
    }
  };

  const updateCommentHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const id = parseInt(
      (form.elements.namedItem("id") as HTMLInputElement).value,
      10
    );
    const content = (form.elements.namedItem("content") as HTMLTextAreaElement)
      .value;
    const authorEmail = (
      form.elements.namedItem("authorEmail") as HTMLInputElement
    ).value;

    try {
      await updateComment({
        variables: {
          id,
          content,
          authorEmail,
        },
      });
      await refetch();
      setShowUpdateModal(false);
      setSelectedComment(null);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <div className="p-6">
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
        Comments
      </h1>

      {data?.taskComment?.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-gray-800  rounded-lg text-sm p-4">
            <thead>
              <tr>
                <th className="px-4 py-2 ">Author</th>
                <th className="px-4 py-2 ">Content</th>
                <th className="px-4 py-2 "></th>
              </tr>
            </thead>
            <tbody>
              {data.taskComment.map((comment: Comment) => (
                <tr key={comment.id}>
                  <td className="px-4 py-2 border">{comment.authorEmail}</td>
                  <td className="px-4 py-2 border">{comment.content}</td>
                  <td className="px-4 py-2 ">
                    <button
                      style={{
                        backgroundColor: "#4DA8DA",
                      }}
                      className="text-white px-3 py-1 rounded hover:bg-blue-700"
                      onClick={() => {
                        setSelectedComment(comment);
                        setShowUpdateModal(true);
                      }}
                    >
                      Update Comment
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="text-lg font-semibold m-4 text-white">Add a Comment</h2>
      <form onSubmit={addCommentHandler} className="space-y-2">
        <textarea
          name="content"
          placeholder="Write your comment..."
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="authorEmail"
          type="email"
          placeholder="Your email"
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Add Comment
        </button>
      </form>

      {showUpdateModal && selectedComment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Update Comment</h3>
            <form onSubmit={updateCommentHandler}>
              <input
                name="id"
                type="text"
                value={selectedComment?.id ?? ""}
                readOnly
                className="w-full mb-2 p-2 border rounded bg-gray-100 text-gray-600"
              />
              <textarea
                name="content"
                defaultValue={selectedComment.content}
                className="w-full mb-2 p-2 border rounded"
                required
              />
              <input
                name="authorEmail"
                type="email"
                defaultValue={selectedComment.authorEmail}
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
                setSelectedComment(null);
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

export default Comments;
