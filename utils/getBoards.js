import { headers } from "next/headers";
import { redirect } from "next/navigation";

const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;

// Fetch boards infomation
async function fetchBoards() {
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
    redirect("/login");
    console.error(error);
    return [];
  }
}

export { fetchBoards };
