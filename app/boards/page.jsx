import React from "react";
import CreateBoard from "@/components/CreateBoard";
import { fetchBoards } from "@/utils/getBoards";
import BoardCard from "@/components/BoardCard";

// Force dynamic rendering
export const dynamic = "force-dynamic";

const BoardsPage = async () => {
  const boards = await fetchBoards();

  // Sort boards by date
  boards.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  boards.map((board) => console.log("board title", board.title));
  return (
    <section>
      <div className="text-center">
        <h1 className="mb-4 text-3xl font-bold">Boards</h1>
        <div className="mb-8 flex justify-center">
          <CreateBoard />
        </div>
      </div>
      {boards.length === 0 && (
        <div className="text-center">
          <p>No Boards, create one</p>
        </div>
      )}
      {boards.length > 0 && (
        <div className="flex justify-center">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {boards.map((board) => (
              <div key={board._id} className="flex justify-center">
                <BoardCard board={board} />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default BoardsPage;
