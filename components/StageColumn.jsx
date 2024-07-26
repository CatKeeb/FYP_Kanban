import React from "react";

const StageColumn = ({ stage, backgroundColor, children }) => {
  return (
    <div
      className="stage-column relative m-3 min-h-[30vh] overflow-auto rounded-xl p-4 sm:min-h-[30vh] md:min-h-[30vh] lg:min-h-[30vh] xl:min-h-[70vh]"
      style={{ backgroundColor, maxHeight: "90vh" }}
    >
      <h3 className="stage-title mb-2 text-center text-lg font-bold">
        {stage}
      </h3>
      <div className="stage-content relative z-0">{children}</div>
    </div>
  );
};

export default StageColumn;
