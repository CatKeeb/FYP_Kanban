import { NextResponse } from "next/server";
import { Server } from "socket.io";
import connectDB from "@/config/database";
import { ObjectId } from "mongodb";

export async function GET(request) {
  if (global.io) {
    return NextResponse.json({ message: "Socket is already running" });
  }

  const io = new Server(request.socket.server);
  global.io = io;

  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("watchBoard", async (boardId) => {
      console.log("Watching board:", boardId);

      const connection = await connectDB();
      const collection = connection.collection("boards");

      const changeStream = collection.watch([
        {
          $match: {
            "documentKey._id": new ObjectId(boardId),
            operationType: { $in: ["update", "replace", "delete"] },
          },
        },
      ]);

      changeStream.on("change", (change) => {
        io.emit("boardUpdate", { boardId, change });
      });

      changeStream.on("error", (error) => {
        console.error("Change stream error:", error);
      });

      socket.on("disconnect", () => {
        changeStream.close();
      });
    });
  });

  return NextResponse.json({ message: "Socket is running" });
}
