"use client";
import React from "react";
import StageColumn from "@/components/StageColumn";
import TaskCard from "@/components/TaskCard";
import CreateTask from "@/components/CreateTask";

const page = () => {
  return (
    <div>
      <CreateTask />
      <div className="kanban-board grid grid-cols-4 gap-4">
        <StageColumn stage="Backlog" backgroundColor="#B5C0D0">
          <TaskCard title="Task 1" description="Description for Task 1" />
          <TaskCard title="Task 2" description="Description for Task 2" />
          <TaskCard title="Task 3" description="Description for Task 3" />
        </StageColumn>
        <StageColumn stage="Doing" backgroundColor="#7BD3EA">
          <TaskCard title="Task 4" description="Description for Task 4" />
          <TaskCard title="Task 5" description="Description for Task 5" />
        </StageColumn>
        <StageColumn stage="Review" backgroundColor="#AD88C6">
          <TaskCard title="Task 6" description="Description for Task 6" />
        </StageColumn>
        <StageColumn stage="Done" backgroundColor="#ACE1AF">
          <TaskCard title="Task 7" description="Description for Task 7" />
          <TaskCard title="Task 8" description="Description for Task 8" />
        </StageColumn>
      </div>
    </div>
  );
};

export default page;
