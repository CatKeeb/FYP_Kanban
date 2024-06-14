export async function updateTask({
  boardId,
  taskId,
  title,
  description,
  stage,
}) {
  try {
    console.log(
      "Board ID:",
      boardId,
      "Title:",
      title,
      "Description:",
      description,
      "Stage:",
      stage,
    );
    fetch("/api/tasks", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        boardId,
        title,
        description,
        stage,
        taskId,
      }),
    });
  } catch (error) {
    console.error("Error updating task:", error);
    return null;
  }
}
