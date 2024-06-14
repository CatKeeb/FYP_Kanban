export async function deleteTask({ boardId, taskId }) {
  try {
    fetch("/api/tasks", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        boardId,
        taskId,
      }),
    });
  } catch (error) {
    console.error("Error deleting task:", error);
  }
}
