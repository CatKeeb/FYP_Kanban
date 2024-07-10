"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const CreateBoard = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("members", members);

    try {
      const response = await fetch("/api/boards", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // Board created successfully
        const data = await response.json();
        document.getElementById("my_modal_5").close();
        router.push(`/boards/${data.boardId}`);
      } else {
        // Handle error
        const errorData = await response.text();
        setError(errorData);
      }
    } catch (error) {
      setError("An error occurred while creating the board.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        className="btn"
        onClick={() => document.getElementById("my_modal_5").showModal()}
      >
        Create Board
      </button>
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="mb-3 text-center text-lg font-bold">Create Board</h3>
          {error && (
            <div className="alert alert-error mb-4">
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
              <span>{error}</span>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
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
                placeholder="Enter board title"
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
                placeholder="Enter board description"
                className="textarea textarea-bordered w-full max-w-xs"
              ></textarea>
            </div>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">
                  Members (comma-separated emails)
                </span>
              </label>
              <input
                type="text"
                name="members"
                value={members}
                onChange={(e) => setMembers(e.target.value)}
                placeholder="Enter member emails"
                className="input input-bordered w-full max-w-xs"
              />
            </div>
            <div className="modal-action justify-end space-x-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    Creating{" "}
                    <span className="loading loading-dots loading-sm"></span>
                  </>
                ) : (
                  "Create"
                )}
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => document.getElementById("my_modal_5").close()}
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

export default CreateBoard;
