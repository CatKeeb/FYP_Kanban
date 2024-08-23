import connectDB from "@/config/database";
import Board from "@/models/Board";
import User from "@/models/User";
import { getSessionUser } from "@/utils/getSessionUser";

export const GET = async (req) => {
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

    // Get the members string and split it into an array of emails
    const membersEmails = formData.get("members")
      ? formData
          .get("members")
          .split(",")
          .map((email) => email.trim())
      : [];

    // Find users by their emails
    const members = await User.find({ email: { $in: membersEmails } });

    // Check if all emails correspond to existing users
    const foundEmails = members.map((member) => member.email);
    const notFoundEmails = membersEmails.filter(
      (email) => !foundEmails.includes(email),
    );

    if (notFoundEmails.length > 0) {
      return new Response(
        `The following emails were not found: ${notFoundEmails.join(", ")}`,
        { status: 400 },
      );
    }

    // Create a new array of member IDs, excluding the owner's ID and any duplicates
    const memberIds = Array.from(
      new Set([...members.map((member) => member._id), userId]),
    );

    // Create a new board object with the form data

    const boardData = {
      title: formData.get("title"),
      description: formData.get("description"),
      owner: userId,
      members: memberIds,
      tasks: [],
    };
    // Create a new board document in the database and save it
    const newBoard = await Board.create(boardData);
    await newBoard.save();

    // Return the new board's ID
    return new Response(JSON.stringify({ boardId: newBoard._id }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log(error.message);
    return new Response(error.message, { status: 500 });
  }
};
