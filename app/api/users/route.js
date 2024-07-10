import connectDB from "@/config/database";
import User from "@/models/User";

export async function POST(request) {
  try {
    await connectDB();

    const { userIds } = await request.json();

    if (!Array.isArray(userIds)) {
      return new Response(
        JSON.stringify({ error: "userIds must be an array" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const users = await User.find(
      { _id: { $in: userIds } },
      "firstName lastName email",
    );
    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
