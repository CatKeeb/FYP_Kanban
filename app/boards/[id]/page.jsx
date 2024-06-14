"use client";
import React from "react";
import StageColumn from "@/components/StageColumn";
import TaskCard from "@/components/TaskCard";
import CreateTask from "@/components/CreateTask";
import { fetchBoard } from "@/utils/getBoard";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import TaskAlert from "@/components/TaskAlert";

const Boardpage = () => {
  const { id: boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [ShowCreateAlert, setShowCreateAlert] = useState(false);
  const [ShowStageUpdateAlert, setShowStageUpdateAlert] = useState(false);
  const [stage, setStage] = useState(null);

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

  useEffect(() => {
    fetchBoardData();
  }, [boardId]);

  const handleTaskCreated = () => {
    fetchBoardData().then(() => {
      setShowCreateAlert(true);
      setTimeout(() => {
        setShowCreateAlert(false);
      }, 5000);
    });
  };
  const handleTaskDelete = () => {
    fetchBoardData().then(() => {
      setShowDeleteAlert(true);
      setTimeout(() => {
        setShowDeleteAlert(false);
      }, 5000);
    });
  };

  const handleUpdateStage = (newStage) => {
    fetchBoardData().then(() => {
      setStage(newStage);
      setShowStageUpdateAlert(true);
      setTimeout(() => {
        setShowStageUpdateAlert(false);
        setStage(null);
      }, 5000);
    });
  };

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
      {showDeleteAlert && (
        <TaskAlert type="success" description="Task Deleted" />
      )}
      {ShowCreateAlert && (
        <TaskAlert type="success" description="Task Created" />
      )}
      {ShowStageUpdateAlert && (
        <TaskAlert type="success" description={`Move to ${stage}`} />
      )}
      <div className="m-4 flex items-center justify-start p-4">
        <h1 className="text-2xl font-bold">{board.title}</h1>
        <div className="ml-4">
          <CreateTask onTaskCreated={handleTaskCreated} />
        </div>
      </div>
      <div className="relative grid grid-cols-4 gap-4">
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
                  stage={task.stage}
                  boardId={boardId}
                  taskId={task._id}
                  onTaskCreated={handleTaskCreated}
                  onTaskDelete={handleTaskDelete}
                  onStageUpdate={handleUpdateStage}
                />
              ))}
          </StageColumn>
        ))}
      </div>
    </div>
  );
};

export default Boardpage;
