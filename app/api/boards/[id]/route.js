import connectDB from "@/config/database";
import Board from "@/models/Board";
import { getSessionUser } from "@/utils/getSessionUser";

export const GET = async (req, { params }) => {
  try {
    await connectDB();
    const sessionUser = await getSessionUser();
    const { userId } = sessionUser;
    const { id: boardId } = params;
    console.log("userId : ", userId);
    const board = await Board.findOne({
      _id: boardId,
      $or: [{ owner: userId }, { members: { $in: [userId] } }],
    });

    if (!board) {
      return new Response("Board not found or unauthorized access", {
        status: 404,
      });
    }

    return new Response(JSON.stringify(board), {
      status: 200,
    });
  } catch (error) {
    console.log(error.message);
    return new Response(error.message, { status: 500 });
  }
};
