import connectDB from "@/config/database";
import { getSessionUser } from "@/utils/getSessionUser";
import Board from "@/models/Board";
import { ObjectId } from "mongodb";

// Helper function to check if the user is a board member
async function isBoardMember(boardId, userId) {
  const board = await Board.findOne({
    _id: boardId,
    $or: [{ owner: userId }, { members: userId }],
  });
  return !!board;
}

export const POST = async (req, res) => {
  try {
    await connectDB();

    // Get the user's session
    const sessionUser = await getSessionUser();
    // Check if the user is authenticated
    if (!sessionUser || !sessionUser.userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Extract from the request body
    const { boardId, title, description, priority, dueDate, assignee } =
      await req.json();

    // Check if the user is a board member
    if (!(await isBoardMember(boardId, sessionUser.userId))) {
      return new Response("Forbidden: You are not a member of this board", {
        status: 403,
      });
    }
    // Create a new task object with the extracted data
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

export const PATCH = async (req, res) => {
  try {
    await connectDB();

    // Get the authenticated user's session information
    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Extract from the request body
    const { boardId, taskId, title, description, stage } = await req.json();

    // Check if the user is a board member
    if (!(await isBoardMember(boardId, sessionUser.userId))) {
      return new Response("Forbidden: You are not a member of this board", {
        status: 403,
      });
    }

    // Find the board and update the specific task
    const updatedBoard = await Board.findOneAndUpdate(
      // Find the board with the specified boardId and taskId
      { _id: boardId, "tasks._id": taskId },
      // Update the task
      {
        $set: {
          "tasks.$.title": title,
          "tasks.$.description": description,
          "tasks.$.stage": stage,
        },
      },
      { new: true }, // Return the updated document
    );

    if (!updatedBoard) {
      return new Response("Board or Task not found", { status: 404 });
    }

    const updatedTask = updatedBoard.tasks.id(taskId);
    // Return the updated task
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

export const DELETE = async (req, res) => {
  try {
    await connectDB();

    // Get the authenticated user's session information
    const sessionUser = await getSessionUser();
    // Check if the user is authenticated
    if (!sessionUser || !sessionUser.userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Extract the boardId and taskId from the request body
    const { boardId, taskId } = await req.json();

    // Check if the user is a board member
    if (!(await isBoardMember(boardId, sessionUser.userId))) {
      return new Response("Forbidden: You are not a member of this board", {
        status: 403,
      });
    }

    // Find the board and update it by removing the task
    const result = await Board.findOneAndUpdate(
      {
        // Find the board with the specified boardId
        _id: ObjectId.createFromHexString(boardId),
        // Check if the user is the owner or a member of the board
        $or: [
          { owner: ObjectId.createFromHexString(sessionUser.userId) },
          { members: ObjectId.createFromHexString(sessionUser.userId) },
        ],
        // Find the task within the board with the specified taskId
        "tasks._id": ObjectId.createFromHexString(taskId),
      },
      // Remove the task from the tasks array using the $pull operator
      { $pull: { tasks: { _id: ObjectId.createFromHexString(taskId) } } },
      { new: true }, // Return the updated document
    );

    // If no matching board is found or the user doesn't have permission
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
