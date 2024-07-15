import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const commentSchema = new Schema({
  user: {
    _id: Schema.Types.ObjectId,
    firstName: String,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const attachmentSchema = new Schema({
  fileName: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
});

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  stage: {
    type: String,
    enum: ["Backlog", "Doing", "Review", "Done"],
    default: "Backlog",
  },
  dueDate: {
    type: Date,
    required: true,
  },
  assignee: {
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
  },
  comments: [commentSchema],
  attachments: [attachmentSchema],
});

const boardSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  tasks: [taskSchema],
});

const Board = models.Board || model("Board", boardSchema);

export default Board;
