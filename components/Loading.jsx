import React from "react";

const Loading = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="mb-4 text-2xl font-semibold text-gray-700">
        <span>Loading </span>
        <span className="loading loading-dots loading-lg text-primary"></span>
      </div>
    </div>
  );
};

export default Loading;
