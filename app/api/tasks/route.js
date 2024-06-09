import connectDB from "@/config/database";
import { getSessionUser } from "@/utils/getSessionUser";
import Board from "@/models/Board";

export const POST = async (req, res) => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    const { userId } = sessionUser;
    if (!sessionUser || !sessionUser.userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { boardId, title, description } = await req.json();

    const board = await Board.findById(boardId);
    if (!board) {
      return new Response("Board not found", { status: 404 });
    }

    const taskData = {
      title,
      description,
      assignee: {
        _id: sessionUser._id,
        firstName: sessionUser.firstName,
      },
      comments: [],
      attachments: [],
    };

    board.tasks.push(taskData);
    await board.save();

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
