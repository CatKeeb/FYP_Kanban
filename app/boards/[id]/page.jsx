"use client";
import React from "react";
import StageColumn from "@/components/StageColumn";
import TaskCard from "@/components/TaskCard";
import CreateTask from "@/components/CreateTask";
import { fetchBoard } from "@/utils/getBoard";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const Boardpage = () => {
  const { id: boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        const data = await fetchBoard(boardId);
        setBoard(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchBoardData();
  }, [boardId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  const stageColors = {
    Backlog: "#B5C0D0",
    Doing: "#7BD3EA",
    Review: "#AD88C6",
    Done: "#ACE1AF",
  };
  const stages = ["Backlog", "Doing", "Review", "Done"];
  return (
    <div>
      <CreateTask />
      <div className="kanban-board grid grid-cols-4 gap-4">
        {stages.map((stage) => (
          <StageColumn
            key={stage}
            stage={stage}
            backgroundColor={stageColors[stage]}
          >
            {board.tasks
              .filter((task) => task.stage === stage)
              .map((task) => (
                <TaskCard
                  key={task._id}
                  title={task.title}
                  description={task.description}
                />
              ))}
          </StageColumn>
        ))}
      </div>
    </div>
  );
};

export default Boardpage;
