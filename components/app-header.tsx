"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { AuthNav } from "@/components/auth-nav";
import { Separator } from "@/components/ui/separator";

interface NavItem {
  label: string;
  href: string;
  requiresAuth: boolean;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", requiresAuth: true },
  { label: "Trade Accounts", href: "/trade-accounts", requiresAuth: true },
];

export function AppHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAuthenticated = !!session;

  // Filter nav items based on authentication status
  const visibleNavItems = navItems.filter(item => !item.requiresAuth || isAuthenticated);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full max-w-[2000px] mx-auto px-4 md:px-6 lg:px-8 flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold text-xl bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            PuckFinance
          </span>
        </Link>
        
        {visibleNavItems.length > 0 && (
          <>
            <Separator orientation="vertical" className="h-6 mx-4" />
            <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
              {visibleNavItems.map(item => {
                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      isActive 
                        ? "text-foreground" 
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </>
        )}
        
        <div className="ml-auto flex items-center space-x-4">
          <AuthNav />
        </div>
      </div>
    </header>
  );
} 