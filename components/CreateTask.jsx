"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import ErrorMessage from "./ErrorMessage";

const CreateTask = ({ onTaskCreated, boardMembers }) => {
  const { id: boardId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [assignee, setAssignee] = useState({ _id: "", firstName: "" });
  const [error, setError] = useState(null);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Low":
        return "text-green-500";
      case "Medium":
        return "text-yellow-500";
      case "High":
        return "text-red-500";
      default:
        return "";
    }
  };
  const handleAssigneeChange = (e) => {
    const selectedMember = boardMembers.find(
      (member) => member._id === e.target.value,
    );
    if (selectedMember) {
      setAssignee({
        _id: selectedMember._id,
        firstName: selectedMember.firstName,
      });
    } else {
      setAssignee({ _id: "", firstName: "" });
    }
  };

  const clearFormFields = () => {
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setDueDate("");
    setAssignee({ _id: "", firstName: "" });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      setError("Please enter a title.");
      return;
    }

    if (!dueDate) {
      setError("Please select a due date.");
      return;
    }

    if (!priority) {
      setError("Please select a priority.");
      return;
    }

    if (!assignee._id) {
      setError("Please select an assignee.");
      return;
    }
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
          priority,
          dueDate,
          assignee: {
            _id: assignee._id,
            firstName: assignee.firstName,
          },
        }),
      });

      if (response.ok) {
        // Task created successfully
        const data = await response.json();
        console.log("Task created:", data);
        // Reset form fields
        clearFormFields();
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
        className="btn btn-primary"
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
          {error && <ErrorMessage message={error} />}
          <form
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
                className="input input-bordered w-full max-w-xs font-bold"
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
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Priority</span>
              </label>
              <select
                name="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className={`select select-bordered w-full max-w-xs font-bold ${getPriorityColor(priority)}`}
              >
                <option value="Low" className="font-bold text-green-500">
                  Low
                </option>
                <option value="Medium" className="font-bold text-yellow-500">
                  Medium
                </option>
                <option value="High" className="font-bold text-red-500">
                  High
                </option>
              </select>
            </div>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Due Date</span>
              </label>
              <input
                type="date"
                name="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="input input-bordered w-full max-w-xs"
                required
              />
            </div>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Assignee</span>
              </label>
              <select
                name="assignee"
                value={assignee._id}
                onChange={handleAssigneeChange}
                className="select select-bordered w-full max-w-xs"
                required
              >
                <option value="" disabled>
                  Select a member
                </option>
                {boardMembers.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.firstName}
                  </option>
                ))}
              </select>
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
                onClick={() => {
                  clearFormFields();
                  document.getElementById("create_task_modal").close();
                }}
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
