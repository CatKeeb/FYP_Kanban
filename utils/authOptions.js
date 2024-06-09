import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/config/database";
import User from "@/models/User";
import { compare } from "bcryptjs";

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      // Define the authorize function to authenticate the user
      async authorize(credentials) {
        await connectDB();

        // Check if the user exists
        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error("No user found with this email");
        }

        // Compare the provided password with the stored password
        const isPasswordValid = await compare(
          credentials.password,
          user.password,
        );
        if (!isPasswordValid) {
          throw new Error("Password is incorrect");
        }

        // Return the user object
        return {
          id: user._id.toString(),
          email: user.email,
          username: user.username,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, session }) {
      if (user) {
        token.user = user;
        token.user.id = user.id.toString();
      }
      return token;
    },
    async session({ session, token, user }) {
      session.user = token.user;
      session.user.id = token.user.id;
      return session;
    },
  },
};
