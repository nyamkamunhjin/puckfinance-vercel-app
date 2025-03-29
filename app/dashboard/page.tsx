"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

// Some mock data for dashboard stats
const stats = [
  { 
    title: "Total Balance", 
    value: "$12,345.67", 
    change: "+5.23%", 
    isPositive: true 
  },
  { 
    title: "Active Trades", 
    value: "7", 
    change: "+2", 
    isPositive: true 
  },
  { 
    title: "Last 7 Days P&L", 
    value: "$432.10", 
    change: "-1.45%", 
    isPositive: false 
  },
  { 
    title: "Connected Exchanges", 
    value: "2", 
    change: "", 
    isPositive: true 
  }
];

export default function DashboardPage() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    // Wait until session is loaded then redirect to the homepage
    if (status !== "loading") {
      router.replace("/");
    }
  }, [router, status]);

  // Return a loading indicator while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
} 