import connectDB from "@/config/database";
import { verifyPassword } from "@/utils/auth";
import User from "@/models/User";

export async function POST(request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return new Response(
      JSON.stringify({ error: "Email and password are required" }),
      {
        status: 400,
      }
    );
  }

  try {
    await connectDB();
    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found");
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 401,
      });
    }

    const passwordMatches = await verifyPassword(password, user.password);

    if (!passwordMatches) {
      return new Response(JSON.stringify({ error: "Invalid password" }), {
        status: 401,
      });
    }
    console.log("User logged in successfully:");
    console.log("Email:", user.email);
    console.log("Name:", user.firstName + " " + user.lastName);

    // At this point, the user is authenticated.
    // You might want to generate a JWT or similar for the user to use for future authenticated requests.

    return new Response(JSON.stringify({ message: "Login successful" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
