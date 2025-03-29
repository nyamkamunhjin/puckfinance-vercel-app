"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AuthGuard } from "@/components/auth-guard";
import { getTradeAccountById, updateTradeAccount, Provider } from "@/lib/trade-accounts";
import Link from "next/link";
import React from "react";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditTradeAccountPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const router = useRouter();
  const { data: session } = useSession();
  // Use params as a Promise or as a direct value
  const { id } = 'then' in params ? React.use(params) : params;
  
  const [name, setName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [provider, setProvider] = useState<Provider>("BINANCE");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccount = async () => {
      if (!session?.accessToken) return;
      
      try {
        setLoading(true);
        const account = await getTradeAccountById(id, session.accessToken);
        setName(account.name);
        setApiKey(account.apiKey);
        setSecretKey(account.secretKey);
        setProvider(account.provider);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to fetch trade account");
      } finally {
        setLoading(false);
      }
    };

    if (session?.accessToken) {
      fetchAccount();
    }
  }, [id, session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.accessToken) {
      setError("Not authenticated");
      return;
    }
    
    setError(null);
    setUpdating(true);

    try {
      // Only updating the name
      await updateTradeAccount(id, {
        name,
        // We're not using these values anymore but need to include them for type compatibility
        apiKey: "",
        secretKey: "",
        provider: provider as Provider
      }, session.accessToken);
      router.push("/trade-accounts");
    } catch (err: any) {
      setError(err.message || "Failed to update trade account");
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background flex flex-col">
          <AppHeader />
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background flex flex-col">
        <AppHeader />
        
        <main className="flex-1 container py-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold tracking-tight">Edit Trade Account</h1>
              <Button variant="outline" asChild>
                <Link href="/trade-accounts">
                  Back to Accounts
                </Link>
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Edit Account Name</CardTitle>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} id="edit-account-form" className="space-y-6">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Account Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>

                    <div className="grid gap-2">
                      <label htmlFor="provider" className="text-sm font-medium">
                        Provider <span className="text-muted-foreground text-xs">(Read only)</span>
                      </label>
                      <input
                        type="text"
                        id="provider"
                        value={provider}
                        disabled
                        className="flex h-9 w-full rounded-md border border-input bg-muted px-3 py-1 text-sm shadow-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground cursor-not-allowed disabled:opacity-50"
                      />
                    </div>

                    <div className="grid gap-2">
                      <label htmlFor="apiKey" className="text-sm font-medium">
                        API Key <span className="text-muted-foreground text-xs">(Read only)</span>
                      </label>
                      <input
                        type="text"
                        id="apiKey"
                        value={apiKey.substring(0, 10) + "..."}
                        disabled
                        className="flex h-9 w-full rounded-md border border-input bg-muted px-3 py-1 text-sm shadow-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground cursor-not-allowed disabled:opacity-50 font-mono"
                      />
                    </div>

                    <div className="grid gap-2">
                      <label htmlFor="secretKey" className="text-sm font-medium">
                        Secret Key <span className="text-muted-foreground text-xs">(Read only)</span>
                      </label>
                      <input
                        type="password"
                        id="secretKey"
                        value="••••••••••••••••••••"
                        disabled
                        className="flex h-9 w-full rounded-md border border-input bg-muted px-3 py-1 text-sm shadow-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground cursor-not-allowed disabled:opacity-50 font-mono"
                      />
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => router.push("/trade-accounts")}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  form="edit-account-form"
                  disabled={updating}
                >
                  {updating ? "Updating..." : "Update Name"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
} 