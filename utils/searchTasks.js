export const searchTasks = async (boardId, searchTerm) => {
  try {
    const response = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ boardId, searchTerm }),
    });

    if (!response.ok) {
      throw new Error("Search request failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Error searching tasks:", error);
    throw error;
  }
};
