import React from "react";
import Link from "next/link";

const BoardCard = ({ board }) => {
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body items-center text-center">
        <h2 className="card-title">{board.title}</h2>
        <p>{board.description}</p>
        <div className="card-actions">
          <Link href={`/boards/${board._id}`} className="btn btn-primary">
            View Board
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BoardCard;
