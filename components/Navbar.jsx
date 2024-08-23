"use client";
import React, { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Loading from "@/components/Loading";

const Navbar = () => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "loading") {
      setLoading(false);
    }
  }, [status]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="navbar bg-blue-50">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">KanFlow</a>
      </div>
      {session ? (
        <>
          <div className="flex-none">
            <ul className="menu menu-horizontal">
              <li>
                <a href="/boards" className="btn btn-ghost">
                  My Boards
                </a>
              </li>
              <li>
                <a onClick={() => signOut()} className="btn btn-ghost">
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </>
      ) : (
        <div className="flex-none">
          <Link href="/login">
            <button className="btn">Sign In</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
