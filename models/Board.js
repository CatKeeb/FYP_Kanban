import { Schema, model, models } from "mongoose";

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
  dueDate: Date,
  assignee: {
    _id: Schema.Types.ObjectId,
    firstName: String,
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

module.exports = Board;
