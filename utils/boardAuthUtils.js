import Board from "@/models/Board";
import { getSessionUser } from "@/utils/getSessionUser";

export async function isBoardMember(boardId, userId) {
  const board = await Board.findOne({
    _id: boardId,
    $or: [{ owner: userId }, { members: userId }],
  });
  return !!board;
}

export async function authenticateAndAuthorize(req) {
  // Get the user's session
  const sessionUser = await getSessionUser();

  // Check if the user is authenticated
  if (!sessionUser || !sessionUser.userId) {
    return { error: "Unauthorized", status: 401 };
  }

  // Parse the request body once
  const body = await req.json();

  // Extract boardId from the request body
  const { boardId } = body;

  // Check if the user is a board member
  if (!(await isBoardMember(boardId, sessionUser.userId))) {
    return {
      error: "Forbidden: You are not a member of this board",
      status: 403,
    };
  }

  // If everything is okay, return the sessionUser and parsed request body
  return { sessionUser, body };
}
