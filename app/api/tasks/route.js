import connectDB from "@/config/database";
import Board from "@/models/Board";
import { ObjectId } from "mongodb";
import { authenticateAndAuthorize } from "@/utils/boardAuthUtils";

export const POST = async (req) => {
  try {
    await connectDB();

    const authResult = await authenticateAndAuthorize(req);
    if (authResult.error) {
      return new Response(authResult.error, { status: authResult.status });
    }

    const { body } = authResult;
    const { boardId, title, description, priority, dueDate, assignee } = body;

    const taskData = {
      title,
      description,
      assignee,
      priority,
      dueDate,
      comments: [],
      attachments: [],
    };

    // Find the board by ID and update it by pushing the new task to the tasks array
    const updatedBoard = await Board.findByIdAndUpdate(
      boardId,
      { $push: { tasks: taskData } },
      { new: true },
    );

    // If the board is not found
    if (!updatedBoard) {
      return new Response("Board not found", { status: 404 });
    }

    return new Response(JSON.stringify(taskData), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error.message);
    return new Response(error.message, { status: 500 });
  }
};

export const PATCH = async (req) => {
  try {
    await connectDB();

    const authResult = await authenticateAndAuthorize(req);
    if (authResult.error) {
      return new Response(authResult.error, { status: authResult.status });
    }

    const { body } = authResult;
    const { boardId, taskId, title, description, stage } = body;

    // Find the board and update the specific task
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

    const updatedTask = updatedBoard.tasks.id(taskId);
    return new Response(JSON.stringify(updatedTask), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error.message);
    return new Response(error.message, { status: 500 });
  }
};

export const DELETE = async (req) => {
  try {
    await connectDB();

    const authResult = await authenticateAndAuthorize(req);
    if (authResult.error) {
      return new Response(authResult.error, { status: authResult.status });
    }

    const { sessionUser, body } = authResult;
    const { boardId, taskId } = body;

    const result = await Board.findOneAndUpdate(
      {
        _id: ObjectId.createFromHexString(boardId),
        $or: [
          { owner: ObjectId.createFromHexString(sessionUser.userId) },
          { members: ObjectId.createFromHexString(sessionUser.userId) },
        ],
        "tasks._id": ObjectId.createFromHexString(taskId),
      },
      { $pull: { tasks: { _id: ObjectId.createFromHexString(taskId) } } },
      { new: true },
    );

    if (!result) {
      return new Response(
        "No matching board found or you do not have permission",
        { status: 404 },
      );
    }

    return new Response("Task deleted successfully", {
      status: 200,
    });
  } catch (error) {
    console.log(error.message);
    return new Response(error.message, { status: 500 });
  }
};
