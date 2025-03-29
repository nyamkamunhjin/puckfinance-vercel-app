"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
        <Button 
          variant="default" 
          size="sm" 
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Sign out
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/auth/signin">
          Sign in
        </Link>
      </Button>
      <Button variant="default" size="sm" asChild>
        <Link href="/auth/signup">
          Sign up
        </Link>
      </Button>
    </div>
  );
} 