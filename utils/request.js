import { headers } from "next/headers";

const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;

// Fetch board infomation
async function fetchBoards(userId) {
  try {
    const response = await fetch(`${apiDomain}/boards`, {
      cache: "no-store",
      headers: headers(),
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export { fetchBoards };
