"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";

const CreateTask = ({ onTaskCreated }) => {
  const { id: boardId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

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
        onTaskCreated();
      } else {
        // Handle error response
        const error = await response.json();
        console.error("Failed to create task:", error);
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };
  return (
    <div>
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
