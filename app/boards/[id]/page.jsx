"use client";
import React from "react";
import StageColumn from "@/components/StageColumn";
import TaskCard from "@/components/TaskCard";
import CreateTask from "@/components/CreateTask";
import { fetchBoard } from "@/utils/getBoard";
import { useParams } from "next/navigation";
import { useEffect, useState, useMemo, useCallback } from "react";
import TaskAlert from "@/components/TaskAlert";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import io from "socket.io-client";
import { searchTasks } from "@/utils/searchTasks";
import { fetchUserDetails } from "@/utils/getUserDetails";
import { getClientSessionUser } from "@/utils/clientSessionUser";
import { debounce } from "@/utils/debounce";
import TaskCalendar from "@/components/TaskCalendar";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [filterMyTasks, setFilterMyTasks] = useState(false);
  const [sortByPriority, setSortByPriority] = useState(false);
  const [sortByDueDate, setSortByDueDate] = useState(false);
  const [sessionUser, setSessionUser] = useState(null);
  const [viewMode, setViewMode] = useState("board");
  const router = useRouter();

  const toggleFilterMyTasks = () => {
    setFilterMyTasks(!filterMyTasks);
  };

  const toggleSortByPriority = () => {
    if (sortByDueDate) {
      setSortByDueDate(!sortByDueDate);
    }
    setSortByPriority(!sortByPriority);
  };

  const toggleSortByDueDate = () => {
    if (sortByPriority) {
      setSortByPriority(!sortByPriority);
    }
    setSortByDueDate(!sortByDueDate);
  };

  const tasksToDisplay = useMemo(() => {
    let tasks = searchResults || (board && board.tasks) || [];
    if (filterMyTasks && sessionUser) {
      tasks = tasks.filter(
        (task) => task.assignee && task.assignee._id === sessionUser.userId,
      );
    }

    if (sortByPriority) {
      const priorityOrder = { High: 1, Medium: 2, Low: 3 };
      tasks = [...tasks].sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority],
      );
    }

    if (sortByDueDate) {
      tasks = [...tasks].sort(
        (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
      );
    }

    return tasks;
  }, [searchResults, board, filterMyTasks, sortByPriority, sortByDueDate]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    debounceSearch(event.target.value);
  };

  const debounceSearch = useCallback(
    debounce((term) => {
      if (term) {
        performSearch(term);
      } else {
        setSearchResults(null);
      }
    }, 200),
    [],
  );

  const performSearch = async (term) => {
    try {
      const results = await searchTasks(boardId, term);
      setSearchResults(results);
    } catch (error) {
      console.error("Error performing search:", error);
    }
  };

  const fetchBoardData = async () => {
    try {
      const data = await fetchBoard(boardId);
      if (!data) {
        router.push("/404");
        return;
      }
      setBoard(data);

      const memberDetails = await fetchUserDetails(data.members);
      setBoardMembers(memberDetails);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchSessionUser = async () => {
      const user = await getClientSessionUser();
      setSessionUser(user);
    };

    fetchSessionUser();
  }, []);

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
      <div className="m-4 p-4">
        <div className="flex flex-col items-center space-y-4 lg:flex-row lg:justify-between lg:space-y-0">
          <div className="flex items-center justify-center space-x-4">
            <h1 className="text-2xl font-bold">{board.title}</h1>
            <CreateTask
              onTaskCreated={handleTaskCreated}
              boardMembers={boardMembers}
            />
          </div>

          <div className="m-auto flex w-full flex-col items-center space-y-4 lg:w-auto lg:flex-row lg:items-center lg:space-x-4 lg:space-y-0">
            <div className="w-full max-w-xs lg:w-auto">
              <label className="input input-bordered flex w-full items-center gap-2">
                <input
                  type="text"
                  className="grow"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </label>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              <div className="form-control">
                <label className="label cursor-pointer justify-end">
                  <span className="label-text mr-2 whitespace-nowrap font-semibold">
                    Filter My Tasks
                  </span>
                  <input
                    type="checkbox"
                    className="toggle checked:[--tglbg:theme(colors.sky.600)]"
                    checked={filterMyTasks}
                    onChange={toggleFilterMyTasks}
                  />
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer justify-end">
                  <span className="label-text mr-2 whitespace-nowrap font-semibold">
                    Sort by Priority
                  </span>
                  <input
                    type="checkbox"
                    className="toggle checked:[--tglbg:theme(colors.sky.600)]"
                    checked={sortByPriority}
                    onChange={toggleSortByPriority}
                  />
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer justify-end">
                  <span className="label-text mr-2 whitespace-nowrap font-semibold">
                    Sort by Due Date
                  </span>
                  <input
                    type="checkbox"
                    className="toggle checked:[--tglbg:theme(colors.sky.600)]"
                    checked={sortByDueDate}
                    onChange={toggleSortByDueDate}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="my-4 flex justify-center">
          <button
            className="btn btn-primary"
            onClick={() =>
              setViewMode(viewMode === "board" ? "calendar" : "board")
            }
          >
            Switch to {viewMode === "board" ? "Calendar" : "Board"} View
          </button>
        </div>

        {searchTerm && (
          <div className="mt-2 w-full text-center text-lg text-gray-600">
            Searching for: "{searchTerm}"
          </div>
        )}

        {viewMode === "board" ? (
          <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
            {stages.map((stage) => (
              <StageColumn
                key={stage}
                stage={stage}
                backgroundColor={stageColors[stage]}
              >
                {tasksToDisplay
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
        ) : (
          <TaskCalendar tasks={tasksToDisplay} />
        )}
      </div>
    </div>
  );
};

export default Boardpage;
