const connectDB = jest.fn();
const Board = require("@/models/Board");
const { ObjectId } = require("mongodb");

const isBoardMember = jest.fn().mockResolvedValue(true);

const POST = jest.fn(async (req) => {
  await connectDB();
  const { userId, ...body } = req;
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { boardId, title, description, priority, dueDate, assignee } = body;

  if (!(await isBoardMember(boardId, userId))) {
    return new Response("Forbidden: You are not a member of this board", {
      status: 403,
    });
  }

  const newTaskData = {
    title,
    description,
    assignee,
    priority,
    dueDate,
    stage: "To Do",
    comments: [],
    attachments: [],
  };

  const updatedBoard = await Board.findByIdAndUpdate(
    boardId,
    { $push: { tasks: newTaskData } },
    { new: true },
  );

  if (!updatedBoard) {
    return new Response("Board not found", { status: 404 });
  }

  return new Response(JSON.stringify(newTaskData), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
});

const PATCH = jest.fn(async (req) => {
  await connectDB();
  const { userId, ...body } = req;
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { boardId, taskId, title, description, stage } = body;

  if (!(await isBoardMember(boardId, userId))) {
    return new Response("Forbidden: You are not a member of this board", {
      status: 403,
    });
  }

  const updatedBoard = await Board.findOneAndUpdate(
    { _id: boardId, "tasks._id": taskId },
    {
      $set: {
        "tasks.$.title": title,
        "tasks.$.description": description,
        "tasks.$.stage": stage,
      },
    },
    { new: true },
  );

  if (!updatedBoard) {
    return new Response("Board or Task not found", { status: 404 });
  }

  const updatedTask = updatedBoard.tasks.find(
    (task) => task._id.toString() === taskId,
  );
  return new Response(JSON.stringify(updatedTask), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

const DELETE = jest.fn(async (req) => {
  await connectDB();
  const { userId, ...body } = req;
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { boardId, taskId } = body;

  if (!(await isBoardMember(boardId, userId))) {
    return new Response("Forbidden: You are not a member of this board", {
      status: 403,
    });
  }

  const result = await Board.findOneAndUpdate(
    {
      _id: ObjectId(boardId),
      $or: [{ owner: ObjectId(userId) }, { members: ObjectId(userId) }],
      "tasks._id": ObjectId(taskId),
    },
    { $pull: { tasks: { _id: ObjectId(taskId) } } },
    { new: true },
  );

  if (!result) {
    return new Response(
      "No matching board found or you do not have permission",
      { status: 404 },
    );
  }

  return new Response("Task deleted successfully", { status: 200 });
});

module.exports = { POST, PATCH, DELETE, isBoardMember };
