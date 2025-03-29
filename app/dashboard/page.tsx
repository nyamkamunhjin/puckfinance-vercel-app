"use client";

import { AuthGuard } from "@/components/auth-guard";
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

export default function Dashboard() {
  const { data: session, status } = useSession();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background flex flex-col">
        <AppHeader />
        
        <main className="flex-1 container py-6">
          <h1 className="text-3xl font-bold tracking-tight mb-6">Dashboard</h1>
          
          <div className="grid gap-6">
            {/* Welcome card */}
            <Card className="col-span-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-none shadow-md">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border-2 border-primary">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {session?.user?.email?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">Welcome, {session?.user?.email || 'User'}</CardTitle>
                    <CardDescription>Here's an overview of your trading activity</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
            
            {/* Stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {status === "loading" ? (
                // Show skeletons while loading
                Array(4).fill(0).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <Skeleton className="h-4 w-24" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-8 w-20 mb-2" />
                      <Skeleton className="h-4 w-16" />
                    </CardContent>
                  </Card>
                ))
              ) : (
                // Show actual stats
                stats.map((stat, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      {stat.change && (
                        <p className={`text-xs ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                          {stat.change} {stat.isPositive ? '↑' : '↓'}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Quick action cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Trade Accounts Card */}
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Trade Accounts
                    <span className="text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </CardTitle>
                  <CardDescription>Manage your exchange API keys</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Connect to exchanges and manage your trading accounts all in one place.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/trade-accounts">
                      Manage Accounts
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Trading Activity Card */}
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Trading Activity
                    <span className="text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3m0 0l3 3m-3-3v12m6-9l3 3m0 0l3-3m-3 3V6" />
                      </svg>
                    </span>
                  </CardTitle>
                  <CardDescription>View your recent trading activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Track your trade history, performance metrics, and open positions.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" disabled>
                    Coming Soon
                  </Button>
                </CardFooter>
              </Card>

              {/* Settings Card */}
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Settings
                    <span className="text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </span>
                  </CardTitle>
                  <CardDescription>Configure your account settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Customize your profile, notification preferences, and account security.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" disabled>
                    Coming Soon
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
} 