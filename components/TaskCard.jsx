import React from "react";

const TaskCard = ({ title, description }) => {
  return (
    <div className="task-card mb-4 rounded-lg bg-white p-4 shadow-md">
      <h4 className="task-title mb-2 text-lg font-bold">{title}</h4>
      <p className="task-description">{description}</p>
    </div>
  );
};

export default TaskCard;
