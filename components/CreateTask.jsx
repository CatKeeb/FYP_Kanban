"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";

const CreateTask = () => {
  const { id: boardId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          boardId,
          title,
          description,
        }),
      });

      if (response.ok) {
        // Task created successfully
        const data = await response.json();
        console.log("Task created:", data);
        // Reset form fields
        setTitle("");
        setDescription("");
        // Close the modal
        document.getElementById("create_task_modal").close();
        // Show success alert
        setShowSuccessAlert(true);
      } else {
        // Handle error response
        const error = await response.json();
        console.error("Failed to create task:", error);
        // Show error alert
        setShowErrorAlert(true);
      }
    } catch (error) {
      console.error("Error creating task:", error);
      // Show error alert
      setShowErrorAlert(true);
    }
  };
  return (
    <div>
      {showSuccessAlert && (
        <div role="alert" className="alert alert-success">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Task created successfully!</span>
        </div>
      )}
      {showErrorAlert && (
        <div role="alert" className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Failed to create task. Please try again.</span>
        </div>
      )}
      <button
        className="btn"
        onClick={() => document.getElementById("create_task_modal").showModal()}
      >
        Create Task
      </button>
      <dialog
        id="create_task_modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <h3 className="mb-3 text-center text-lg font-bold">Create Task</h3>
          <form
            action="/api/tasks"
            method="POST"
            encType="multipart/form-data"
            className="flex flex-col items-center space-y-4"
          >
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                type="text"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                required
                className="input input-bordered w-full max-w-xs"
              />
            </div>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description"
                className="textarea textarea-bordered w-full max-w-xs"
              ></textarea>
            </div>
            <div className="modal-action justify-end space-x-2">
              <button
                onClick={handleSubmit}
                type="submit"
                className="btn btn-primary"
              >
                Create
              </button>
              <button
                type="button"
                className="btn"
                onClick={() =>
                  document.getElementById("create_task_modal").close()
                }
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default CreateTask;
