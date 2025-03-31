"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AuthGuard } from "@/components/auth-guard";
import { AppHeader } from "@/components/app-header";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Balance, Income, Snapshot, getBalance, getIncome, getSnapshots } from "@/lib/binance";
import { CardChart } from "@/components/ui/card-chart";
import { subDays } from "date-fns";

export default function TradeAccountDashboard() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [balance, setBalance] = useState<Balance | null>(null);
  const [income, setIncome] = useState<Income[]>([]);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.accessToken || !id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch balance data
        const balanceData = await getBalance(id as string, session.accessToken);
        setBalance(balanceData);
        
        // Fetch income data
        const incomeData = await getIncome(id as string, session.accessToken);
        setIncome(incomeData);

        // Fetch snapshot data for the last 30 days
        const endTime = Date.now();
        const startTime = subDays(new Date(), 30).getTime();
        
        const snapshotData = await getSnapshots(
          id as string, 
          startTime,
          endTime,
          session.accessToken
        );
        setSnapshots(snapshotData);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to fetch account data");
      } finally {
        setLoading(false);
      }
    };

    if (session?.accessToken && id) {
      fetchData();
    }
  }, [session, id]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  // Calculate total balance in USD (approximation)
  const getTotalBalance = () => {
    if (!balance) return "0.00";
    
    // For simplicity, we're assuming asset is USDT which is 1:1 with USD
    return parseFloat(balance.availableBalance).toFixed(2);
  };

  // Prepare data for the chart
  const prepareChartData = () => {
    return snapshots.map(snapshot => ({
      time: snapshot.time,
      value: parseFloat(snapshot.totalWalletBalance)
    })).sort((a, b) => a.time - b.time);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background flex flex-col">
        <AppHeader />
        
        <main className="flex-1 w-full max-w-[2000px] mx-auto px-4 md:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Account Dashboard</h1>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href={`/trade-accounts/${id}/trade-history`}>
                  Trade History
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/trade-accounts/${id}`}>
                  Edit Account
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/trade-accounts">
                  All Accounts
                </Link>
              </Button>
            </div>
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
          ) : (
            <>
              {/* Balance Chart */}
              {snapshots.length > 0 && (
                <div className="mb-6">
                  <CardChart 
                    title="Balance History (30 Days)" 
                    data={prepareChartData()} 
                    valuePrefix="$"
                    color="#10b981" // Green color
                  />
                </div>
              )}

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Account Balance Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Account Balance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="text-lg font-semibold">Total Available Balance:</div>
                      <div className="text-3xl font-bold">${getTotalBalance()} USD</div>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <Table>
                        <TableCaption>Current Balance Details</TableCaption>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Asset</TableHead>
                            <TableHead>Total Balance</TableHead>
                            <TableHead>Available Balance</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {!balance ? (
                            <TableRow>
                              <TableCell colSpan={3} className="text-center">No balance data available</TableCell>
                            </TableRow>
                          ) : (
                            <TableRow>
                              <TableCell className="font-medium">{balance.asset}</TableCell>
                              <TableCell>{parseFloat(balance.balance).toFixed(8)}</TableCell>
                              <TableCell>{parseFloat(balance.availableBalance).toFixed(8)}</TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                {/* Income Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Income</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableCaption>Last 10 income entries</TableCaption>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Time</TableHead>
                            <TableHead>Symbol</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {income.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center">No income data available</TableCell>
                            </TableRow>
                          ) : (
                            income.slice(0, 10).map((item) => (
                              <TableRow key={item.tranId}>
                                <TableCell>{formatDate(item.time)}</TableCell>
                                <TableCell>{item.symbol}</TableCell>
                                <TableCell>{item.incomeType}</TableCell>
                                <TableCell className={parseFloat(item.income) >= 0 ? 'text-green-600' : 'text-red-600'}>
                                  {parseFloat(item.income) >= 0 ? '+' : ''}{parseFloat(item.income).toFixed(8)} {item.asset}
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </main>
      </div>
    </AuthGuard>
  );
} 