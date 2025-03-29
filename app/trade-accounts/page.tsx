"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AuthGuard } from "@/components/auth-guard";
import { TradeAccount, getTradeAccounts, deleteTradeAccount } from "@/lib/trade-accounts";
import Link from "next/link";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function TradeAccountsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [accounts, setAccounts] = useState<TradeAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      if (!session?.accessToken) return;
      
      try {
        setLoading(true);
        const data = await getTradeAccounts(session.accessToken);
        setAccounts(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load trade accounts");
      } finally {
        setLoading(false);
      }
    };

    if (session?.accessToken) {
      fetchAccounts();
    }
  }, [session]);

  const handleDelete = async (id: string) => {
    if (!session?.accessToken) return;
    if (!confirm("Are you sure you want to delete this trade account?")) {
      return;
    }

    try {
      await deleteTradeAccount(id, session.accessToken);
      // Update the list after deletion
      setAccounts(accounts.filter(account => account.id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete trade account");
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background flex flex-col">
        <AppHeader />
        
        <main className="flex-1 container py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Trade Accounts</h1>
            <Button asChild>
              <Link href="/trade-accounts/new">
                Add New Account
              </Link>
            </Button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : accounts.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p>No trade accounts found. Add your first trade account to get started.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {accounts.map((account) => (
                <Card key={account.id}>
                  <CardHeader className="pb-2">
                    <CardTitle>{account.name}</CardTitle>
                    <CardDescription>{account.provider}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">
                      <span className="font-medium">API Key:</span>{" "}
                      <span className="font-mono">
                        {account.apiKey.substring(0, 10)}...
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/trade-accounts/${account.id}`}>
                        Edit
                      </Link>
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDelete(account.id)}
                    >
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  );
} 