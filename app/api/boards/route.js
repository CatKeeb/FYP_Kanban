import connectDB from "@/config/database";
import Board from "@/models/Board";
import { getSessionUser } from "@/utils/getSessionUser";

export const GET = async (req, { params }) => {
  try {
    await connectDB();
    const sessionUser = await getSessionUser();
    const { userId } = sessionUser;
    const boards = await Board.find({
      $or: [{ owner: userId }, { members: { $in: [userId] } }],
    });
    console.log("boards", boards);
    return new Response(JSON.stringify(boards), {
      status: 200,
    });
  } catch (error) {
    console.log(error.message);
    return new Response(error.message, { status: 500 });
  }
};

export const POST = async (req, res) => {
  try {
    await connectDB();

    // Get user's session
    const sessionUser = await getSessionUser();
    // Check if the user is authenticated
    if (!sessionUser || !sessionUser.userId) {
      return new Response("Unauthorized", { status: 401 });
    }
    const { userId } = sessionUser;
    // Get the form data from the request
    const formData = await req.formData();
    // Create a new board object with the form data
    const boardData = {
      title: formData.get("title"),
      description: formData.get("description"),
      owner: userId,
      tasks: [],
    };
    // Create a new board document in the database and save it
    const newBoard = await Board.create(boardData);
    await newBoard.save();

    // Redirect the user to the newly created board's page
    return Response.redirect(
      `${process.env.NEXTAUTH_URL}/boards/${newBoard._id}`,
    );
  } catch (error) {
    console.log(error.message);
    return new Response(error.message, { status: 500 });
  }
};
