"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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

export default function Home() {
  const { data: session, status } = useSession();

  // If not authenticated and not loading, show the marketing home page
  if (status !== "loading" && !session) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <AppHeader />
        
        <main className="flex-1">
          {/* Hero Section with enhanced blockchain gradients */}
          <div className="relative overflow-hidden bg-gradient-to-b from-background to-background/90 pb-16 bg-blockchain-glow bg-hero-glow">
            <div className="absolute inset-0 bg-grid-animate bg-grid-glow opacity-100 z-0" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,theme(colors.indigo.500/40%),transparent_50%)] z-0" />
            
            {/* Pulse points */}
            <div className="pulse-point pulse-point-1" style={{ zIndex: 1 }} />
            <div className="pulse-point pulse-point-2" style={{ zIndex: 1 }} />
            <div className="pulse-point pulse-point-3" style={{ zIndex: 1 }} />
            
            <div className="container mx-auto px-4 pt-20 pb-16 text-center lg:pt-32 relative z-10">
              <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blockchain-gradient rounded-full blur-3xl opacity-50 animate-pulse z-0"></div>
              <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blockchain-gradient rounded-full blur-3xl opacity-50 animate-pulse z-0" style={{ animationDelay: '1s' }}></div>
              
              <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mb-6 relative z-10 pb-4">
                Automate Your Crypto Trading Strategy
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-xl text-muted-foreground relative z-10">
                Connect TradingView strategies to exchanges, manage your portfolio, and track performance in one powerful platform.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                <Button asChild size="lg" className="text-base px-8 relative overflow-hidden bg-primary hover:bg-primary/90 bg-shimmer">
                  <Link className="bg-primary" href="/auth/signin">Get Started</Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="text-base px-8 backdrop-blur-sm bg-background/50 border-primary/20">
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </div>
              <div className="mt-14 relative z-10">
                <div className="relative mx-auto max-w-5xl rounded-xl border border-primary/10 shadow-2xl bg-background/50 backdrop-blur-sm overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 z-0 bg-shimmer" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,theme(colors.pink.500/15%),transparent_70%)]" />
                  <div className="absolute inset-0 bg-nodes opacity-10" />
                  
                  <div className="py-16 px-8 flex flex-col items-center justify-center relative z-10">
                    <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center mb-6 relative">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <div className="absolute -inset-1 rounded-full border border-indigo-500/20 animate-pulse"></div>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-center mb-2">Power Your Trading with Automation</h2>
                    <p className="text-center text-muted-foreground max-w-lg mb-6">
                      Connect TradingView alerts to your exchange accounts and let your strategies work for you 24/7.
                    </p>
                    
                    <div className="flex space-x-3">
                      <div className="flex items-center text-sm">
                        <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                        <span>Real-time Execution</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                        <span>Risk Management</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <div className="h-2 w-2 rounded-full bg-purple-500 mr-2"></div>
                        <span>Performance Analytics</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Features Section with blockchain dot patterns */}
          <section className="py-20 bg-muted/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-blockchain-gradient opacity-40 z-0"></div>
            <div className="absolute inset-0 opacity-80 z-0"></div>
            <div className="absolute inset-0 bg-nodes opacity-60 z-0"></div>
            <div className="pulse-point pulse-point-2" style={{ zIndex: 1, animationDelay: '2.5s' }} />
            <div className="pulse-point pulse-point-3" style={{ zIndex: 1, animationDelay: '0.8s' }} />
            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold">All-in-One Trading Solution</h2>
                <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
                  Simplify your trading workflow and maximize performance with our comprehensive platform
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-background/60 backdrop-blur-sm border-primary/10 hover:shadow-md hover:border-primary/20 transition-all relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <CardHeader className="pb-2 relative z-10">
                    <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <CardTitle>TradingView Integration</CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <p className="text-muted-foreground">
                      Seamlessly connect your TradingView strategies directly to Binance, Bybit, and more exchanges coming soon.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-background/60 backdrop-blur-sm border-primary/10 hover:shadow-md hover:border-primary/20 transition-all relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <CardHeader className="pb-2 relative z-10">
                    <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3m0 0l3 3m-3-3v12m6-9l3 3m0 0l3-3m-3 3V6" />
                      </svg>
                    </div>
                    <CardTitle>Portfolio Management</CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <p className="text-muted-foreground">
                      Single source crypto trading portfolio managing with comprehensive performance monitoring across all exchanges.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-background/60 backdrop-blur-sm border-primary/10 hover:shadow-md hover:border-primary/20 transition-all relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <CardHeader className="pb-2 relative z-10">
                    <div className="w-12 h-12 rounded-lg bg-pink-500/10 flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <CardTitle>Multi-Strategy Execution</CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <p className="text-muted-foreground">
                      Run multiple trading strategies simultaneously and monitor their performance in real-time.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-background/60 backdrop-blur-sm border-primary/10 hover:shadow-md hover:border-primary/20 transition-all relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <CardHeader className="pb-2 relative z-10">
                    <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <CardTitle>Performance Analytics</CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <p className="text-muted-foreground">
                      Analyze TradingView strategies performance with detailed metrics and insights to optimize your trading.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
          
          {/* How It Works Section with data line patterns */}
          <section className="py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-data-lines"></div>
            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold">How It Works</h2>
                <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
                  Get started in minutes with our simple three-step process
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center bg-background/40 backdrop-blur-sm p-8 rounded-xl border border-primary/5 relative overflow-hidden group hover:border-primary/10 transition-all">
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto mb-6 relative z-10">
                    <span className="text-2xl font-bold text-indigo-500">1</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 relative z-10">Connect Exchanges</h3>
                  <p className="text-muted-foreground relative z-10">
                    Securely link your Binance, Bybit, or other exchange accounts using API keys.
                  </p>
                </div>
                
                <div className="text-center bg-background/40 backdrop-blur-sm p-8 rounded-xl border border-primary/5 relative overflow-hidden group hover:border-primary/10 transition-all">
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-6 relative z-10">
                    <span className="text-2xl font-bold text-purple-500">2</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 relative z-10">Setup Strategies</h3>
                  <p className="text-muted-foreground relative z-10">
                    Configure your TradingView strategies to execute automatically on your connected exchanges.
                  </p>
                </div>
                
                <div className="text-center bg-background/40 backdrop-blur-sm p-8 rounded-xl border border-primary/5 relative overflow-hidden group hover:border-primary/10 transition-all">
                  <div className="absolute inset-0 bg-gradient-to-t from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="w-16 h-16 rounded-full bg-pink-500/10 flex items-center justify-center mx-auto mb-6 relative z-10">
                    <span className="text-2xl font-bold text-pink-500">3</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 relative z-10">Track Performance</h3>
                  <p className="text-muted-foreground relative z-10">
                    Monitor results, analyze performance, and optimize your strategies for better returns.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          {/* CTA Section with enhanced gradients */}
          <section className="py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-blockchain-gradient opacity-40"></div>
            <div className="absolute inset-0 bg-blockchain-glow"></div>
            <div className="absolute inset-0 bg-nodes"></div>
            <div className="container mx-auto px-4 text-center relative z-10">
              <div className="max-w-3xl mx-auto bg-background/40 backdrop-blur-md p-12 rounded-2xl border border-primary/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-shimmer"></div>
                <h2 className="text-3xl font-bold mb-6 relative z-10">Ready to Elevate Your Trading?</h2>
                <p className="text-xl text-muted-foreground mx-auto mb-10 relative z-10">
                  Join thousands of traders already using our platform to automate and optimize their crypto trading strategies.
                </p>
                <Button asChild size="lg" className="text-base px-8 relative overflow-hidden bg-primary hover:bg-primary/90 bg-shimmer">
                  <Link className="bg-primary" href="/auth/signup">Get Started for Free</Link>
                </Button>
              </div>
            </div>
          </section>
          
          {/* Footer with subtle blockchain theme */}
          <footer className="py-10 border-t relative overflow-hidden">
            <div className="absolute inset-0 bg-data-lines opacity-30"></div>
            <div className="container mx-auto px-4 relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <p className="text-sm text-muted-foreground">
                    © 2025 PuckFinance. All rights reserved.
                  </p>
                </div>
                <div className="flex space-x-6">
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Terms
                  </Link>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Privacy
                  </Link>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Contact
                  </Link>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    );
  }

  // If authenticated, show the dashboard
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      
      <main className="flex-1 w-full max-w-[2000px] mx-auto px-4 md:px-6 lg:px-8 py-6">
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
  );
}
