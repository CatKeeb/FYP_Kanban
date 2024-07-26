import connectDB from "@/config/database";
import Board from "@/models/Board";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { authenticateAndAuthorize } from "@/utils/boardAuthUtils";

export async function POST(request) {
  try {
    await connectDB();
    const authResult = await authenticateAndAuthorize(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status },
      );
    }

    const { body } = authResult;
    const { boardId, searchTerm } = body;

    const result = await Board.aggregate([
      {
        $search: {
          index: "taskSearch",
          compound: {
            should: [
              {
                autocomplete: {
                  query: searchTerm,
                  path: "tasks.title",
                },
              },
              {
                autocomplete: {
                  query: searchTerm,
                  path: "tasks.description",
                },
              },
              {
                autocomplete: {
                  query: searchTerm,
                  path: "tasks.priority",
                },
              },
              {
                autocomplete: {
                  query: searchTerm,
                  path: "tasks.assignee.firstName",
                },
              },
            ],
          },
        },
      },
      {
        $match: { _id: new mongoose.Types.ObjectId(boardId) },
      },
      {
        $unwind: "$tasks",
      },
      {
        $match: {
          $or: [
            { "tasks.title": { $regex: searchTerm, $options: "i" } },
            { "tasks.description": { $regex: searchTerm, $options: "i" } },
            { "tasks.priority": { $regex: searchTerm, $options: "i" } },
            {
              "tasks.assignee.firstName": { $regex: searchTerm, $options: "i" },
            },
          ],
        },
      },
      {
        $group: {
          _id: "$_id",
          tasks: { $push: "$tasks" },
        },
      },
    ]);

    return NextResponse.json(result[0] ? result[0].tasks : []);
  } catch (error) {
    console.error("Error in search route:", error);
    return NextResponse.json(
      { error: "An error occurred while searching tasks" },
      { status: 500 },
    );
  }
}
