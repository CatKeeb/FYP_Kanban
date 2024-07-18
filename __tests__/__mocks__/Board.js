const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema({
  title: String,
  description: String,
  owner: mongoose.Schema.Types.ObjectId,
  members: [mongoose.Schema.Types.ObjectId],
  tasks: [
    {
      title: String,
      description: String,
      priority: String,
      stage: String,
      dueDate: Date,
      assignee: {
        _id: mongoose.Schema.Types.ObjectId,
        firstName: String,
      },
    },
  ],
});

module.exports = mongoose.model("Board", boardSchema);
