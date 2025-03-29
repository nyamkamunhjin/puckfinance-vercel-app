"use client";

import { AuthGuard } from "@/components/auth-guard";
import { AuthNav } from "@/components/auth-nav";
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <AuthNav />
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Welcome, {session?.user?.email}</h2>
            <p className="text-gray-600">
              This is a protected page that requires authentication to access.
            </p>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
} 