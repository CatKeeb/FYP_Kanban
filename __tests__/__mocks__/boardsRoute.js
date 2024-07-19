const connectDB = jest.fn();
const Board = require("./Board");
const User = require("./User");

const GET = async (req, res) => {
  try {
    await connectDB();
    const userId = req.cookies.token; // Assuming you're using cookies for authentication

    // Find boards where the user is either the owner or a member
    const boards = await Board.find({
      $or: [{ owner: userId }, { members: { $in: [userId] } }],
    });
    return res.status(200).json(boards);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }
};

const POST = async (req, res) => {
  try {
    await connectDB();
    const userId = req.cookies.token; // Assuming you're using cookies for authentication
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { title, description, members } = req.body;

    // Process member emails
    const membersEmails = members
      ? members.split(",").map((email) => email.trim())
      : [];

    // Find users with the provided email addresses
    const membersUsers = await User.find({ email: { $in: membersEmails } });

    // Check for any emails that don't correspond to existing users
    const notFoundEmails = membersEmails.filter(
      (email) => !membersUsers.find((user) => user.email === email),
    );

    // If any emails were not found, return an error
    if (notFoundEmails.length > 0) {
      return res.status(400).json({
        error: `The following emails were not found: ${notFoundEmails.join(", ")}`,
      });
    }

    // Create an array of unique member IDs, including the board creator
    const memberIds = Array.from(
      new Set([...membersUsers.map((member) => member._id), userId]),
    );

    // Prepare board data
    const boardData = {
      title,
      description,
      owner: userId,
      members: memberIds,
      tasks: [],
    };

    // Create and save the new board
    const newBoard = await Board.create(boardData);
    await newBoard.save();

    // Return the ID of the newly created board
    return res.status(201).json({ boardId: newBoard._id.toString() });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { GET, POST };
