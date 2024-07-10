"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function NotFound() {
  useEffect(() => {
    // Force light mode
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white text-black">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold">404</h1>
        <p className="mb-4 text-xl">
          Oops! The page you're looking for doesn't exist or you don't have
          access to it.
        </p>
        <Link href="/" className="text-blue-500 hover:underline">
          Go back to homepage
        </Link>
      </div>
    </div>
  );
}
