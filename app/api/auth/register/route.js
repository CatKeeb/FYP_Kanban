import connectDB from "@/config/database";
import { hashPassword } from "@/utils/auth";
import User from "@/models/User";
import sanitizeHtml from 'sanitize-html';

export async function POST(request) {
  await connectDB();

  const { email, password, firstName, lastName } = await request.json();
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return new Response(JSON.stringify({ message: "Email already exists" }), {
      status: 409,
    });
  }
  const hashedPassword = await hashPassword(password);
  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    image: "",
  });
  await newUser.save();
  return new Response(JSON.stringify({ message: "User created" }), {
    status: 201,
  });
}
