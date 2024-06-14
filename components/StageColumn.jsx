import React from "react";

const StageColumn = ({ stage, backgroundColor, children }) => {
  return (
    <div
      className="stage-column relative m-3 min-h-96 overflow-auto rounded-xl p-4"
      style={{ backgroundColor, maxHeight: "80vh" }}
    >
      <h3 className="stage-title mb-2 text-center text-lg font-bold">
        {stage}
      </h3>
      <div className="stage-content relative z-0">{children}</div>
    </div>
  );
};

export default StageColumn;
