"use client";
import React from "react";
import StageColumn from "@/components/StageColumn";
import TaskCard from "@/components/TaskCard";
import CreateTask from "@/components/CreateTask";
import { fetchBoard } from "@/utils/getBoard";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import TaskAlert from "@/components/TaskAlert";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import io from "socket.io-client";

const Boardpage = () => {
  const { id: boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [ShowCreateAlert, setShowCreateAlert] = useState(false);
  const [ShowStageUpdateAlert, setShowStageUpdateAlert] = useState(false);
  const [stage, setStage] = useState(null);
  const [boardMembers, setBoardMembers] = useState([]);
  const router = useRouter();

  const fetchBoardData = async () => {
    try {
      const data = await fetchBoard(boardId);
      if (!data) {
        router.push("/404"); // Redirect to 404 page if board is empty or doesn't exist
        return;
      }
      setBoard(data);

      // Fetch user details for board members
      const memberDetails = await fetchUserDetails(data.members);
      setBoardMembers(memberDetails);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  const fetchUserDetails = async (userIds) => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userIds }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching user details:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchBoardData();

    const socket = io();

    socket.on("connect", () => {
      console.log("Connected to WebSocket");
      socket.emit("watchBoard", boardId);
    });

    socket.on("boardUpdate", (data) => {
      if (data.boardId === boardId) {
        console.log("Board updated, refetching data");
        fetchBoardData();
      }
    });

    return () => {
      socket.off("boardUpdate");
      socket.disconnect();
    };
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
    return <Loading />;
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
          <CreateTask
            onTaskCreated={handleTaskCreated}
            boardMembers={boardMembers}
          />
        </div>
      </div>
      <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
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
                  priority={task.priority}
                  dueDate={task.dueDate}
                  assignee={task.assignee}
                />
              ))}
          </StageColumn>
        ))}
      </div>
    </div>
  );
};

export default Boardpage;
