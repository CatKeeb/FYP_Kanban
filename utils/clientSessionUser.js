export async function getClientSessionUser() {
  try {
    const response = await fetch("/api/auth/session");
    if (response.ok) {
      const sessionUser = await response.json();
      return sessionUser;
    }
    return null;
  } catch (error) {
    console.error("Error fetching session user:", error);
    return null;
  }
}
