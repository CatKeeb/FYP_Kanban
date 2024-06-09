import React from "react";

const StageColumn = ({ stage, backgroundColor, children }) => {
  return (
    <div
      className="stage-column mb-4 rounded-lg p-4"
      style={{ backgroundColor }}
    >
      <h3 className="stage-title mb-2 text-center text-lg font-bold">
        {stage}
      </h3>
      {children}
    </div>
  );
};

export default StageColumn;
