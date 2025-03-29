"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export function AuthNav() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="animate-pulse h-10 w-32 bg-gray-200 rounded"></div>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">{session.user?.email}</span>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-500"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link
        href="/auth/signin"
        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
      >
        Sign in
      </Link>
      <Link
        href="/auth/signup"
        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-500"
      >
        Sign up
      </Link>
    </div>
  );
} 