"use client";

import { useState, useEffect } from "react";
import { SessionProvider } from "next-auth/react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only render the SessionProvider on the client to avoid hydration mismatches
  if (!mounted) {
    return <>{children}</>;
  }

  return <SessionProvider>{children}</SessionProvider>;
} 