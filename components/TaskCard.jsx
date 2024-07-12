import React from "react";
import { updateTask } from "@/utils/updateTask";
import { deleteTask } from "@/utils/deleteTask";
import { format, isValid } from "date-fns";

const TaskCard = ({
  title,
  description,
  stage,
  priority,
  assignee,
  dueDate,
  boardId,
  taskId,
  onTaskCreated,
  onTaskDelete,
  onStageUpdate,
}) => {
  console.log("Title:", title);
  console.log("Description:", description);
  console.log("Stage:", stage);
  console.log("Priority:", priority);
  console.log("Assignee:", assignee);
  console.log("Due Date:", dueDate);
  console.log("BoardId:", boardId);
  console.log("TaskId:", taskId);
  const handleUpdateStage = async () => {
    try {
      let newStage;

      switch (stage) {
        case "Backlog":
          newStage = "Doing";
          break;
        case "Doing":
          newStage = "Review";
          break;
        case "Review":
          newStage = "Done";
          break;
        default:
          return;
      }

      await updateTask({
        boardId,
        taskId,
        title,
        description,
        stage: newStage,
      });
      onStageUpdate(newStage);
    } catch (error) {
      console.error("Error updating task stage:", error);
    }
  };

  // Format the due date
  const formattedDueDate = format(new Date(dueDate), "yyyy-MM-dd");

  const handleDeleteTask = async () => {
    try {
      await deleteTask({ boardId, taskId });
      onTaskDelete();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const renderButton = () => {
    if (stage === "Backlog") {
      return (
        <li>
          <button onClick={handleUpdateStage} className="btn btn-accent m-2">
            Start Task
          </button>
        </li>
      );
    } else if (stage === "Doing") {
      return (
        <li>
          <button onClick={handleUpdateStage} className="btn btn-accent m-2">
            Submit for Review
          </button>
        </li>
      );
    } else if (stage === "Review") {
      return (
        <li>
          <button onClick={handleUpdateStage} className="btn btn-success m-2">
            Complete Task
          </button>
        </li>
      );
    }
    return null;
  };
  console.log("dueDate:", dueDate);

  return (
    <div className="task-card relative mb-4 rounded-lg bg-white p-4 shadow-md">
      <div className="flex items-center justify-between">
        <h4 className="task-title mb-2 text-lg font-bold">{title}</h4>
        <div className="m-2 flex items-center">
          <span
            className={`badge px-3 py-3 ${
              priority === "High"
                ? "badge-error"
                : priority === "Medium"
                  ? "badge-warning"
                  : "badge-success"
            } font-semibold`}
          >
            {priority}
          </span>
          <div className="dropdown dropdown-end dropdown-bottom ml-2">
            <label tabIndex={0} className="btn btn-circle btn-ghost btn-xs">
              {/* Dropdown icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu dropdown-content absolute z-10 w-52 rounded-box bg-base-100 p-2 shadow"
            >
              {renderButton()}
              <li>
                <button
                  onClick={handleDeleteTask}
                  className="btn btn-error m-2"
                >
                  Delete Task
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="task-description">{description}</p>
      </div>
      <div className="mt-2 flex items-center justify-between pt-2">
        <p className="text-sm font-semibold">Due Date: {formattedDueDate}</p>
      </div>
    </div>
  );
};

export default TaskCard;
