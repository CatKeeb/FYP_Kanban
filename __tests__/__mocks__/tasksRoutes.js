const connectDB = jest.fn();
const { ObjectId } = require("mongodb");

const isBoardMember = jest.fn().mockResolvedValue(true);

const POST = jest.fn(async (req) => {
  const { userId, ...body } = req;
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { title, description, priority, dueDate, assignee } = body;

  const newTaskData = {
    _id: new ObjectId().toString(),
    title,
    description,
    assignee,
    priority,
    dueDate,
    stage: "To Do",
    comments: [],
    attachments: [],
  };

  return new Response(JSON.stringify(newTaskData), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
});

const PATCH = jest.fn(async (req) => {
  const { userId, ...body } = req;
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { title, description, stage } = body;

  const updatedTask = {
    _id: new ObjectId().toString(),
    title,
    description,
    stage,
    // Add other fields as needed
  };

  return new Response(JSON.stringify(updatedTask), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

const DELETE = jest.fn(async (req) => {
  const { userId, ...body } = req;
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  return new Response("Task deleted successfully", { status: 200 });
});

module.exports = { POST, PATCH, DELETE, isBoardMember };
