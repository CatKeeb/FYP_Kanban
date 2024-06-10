const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;

// Fetch board information based on board ID
export async function fetchBoard(boardId) {
  try {
    const response = await fetch(`${apiDomain}/boards/${boardId}`, {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
