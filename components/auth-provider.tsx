"use client";

import { useState, useEffect } from "react";
import { SessionProvider } from "next-auth/react";

export function AuthProvider({ children }: { children: React.ReactNode }) {

  return <SessionProvider>{children}</SessionProvider>;
} 