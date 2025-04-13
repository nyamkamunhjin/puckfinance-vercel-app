"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { Income, getIncome } from "@/lib/binance";
import { TradeAccount, getTradeAccounts } from "@/lib/trade-accounts";
import { format } from "date-fns";
import { CartesianGrid, XAxis, YAxis, AreaChart, Area, Legend, Tooltip, ResponsiveContainer } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface AccountWithIncome {
  account: TradeAccount;
  incomeData: Income[];
}

// Chart colors for different accounts
const CHART_COLORS = [
  "oklch(0.723 0.219 149.579)", // Primary blue
  "oklch(0.78 0.19 30)",        // Orange
  "oklch(0.65 0.15 120)",       // Green
  "oklch(0.7 0.18 190)",        // Purple
  "oklch(0.65 0.22 60)",        // Red
  "oklch(0.75 0.12 90)",        // Teal
];

export default function PnlChart() {
  const { data: session } = useSession();
  const [accountsWithIncome, setAccountsWithIncome] = useState<AccountWithIncome[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllAccountsIncome = async () => {
      if (!session?.accessToken) return;

      try {
        setLoading(true);
        const accounts = await getTradeAccounts(session.accessToken);
        
        const accountsWithIncomeData = await Promise.all(
          accounts.map(async (account) => {
            try {
              const incomeData = await getIncome(account.id, session.accessToken);
              return { account, incomeData };
            } catch (err) {
              console.error(`Failed to fetch income for account ${account.id}:`, err);
              return { account, incomeData: [] };
            }
          })
        );

        setAccountsWithIncome(accountsWithIncomeData);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load account income data");
      } finally {
        setLoading(false);
      }
    };

    if (session?.accessToken) {
      fetchAllAccountsIncome();
    }
  }, [session]);

  const accountColors = useMemo(() => {
    const colors: Record<string, string> = {};
    accountsWithIncome.forEach(({ account }, index) => {
      colors[account.name] = CHART_COLORS[index % CHART_COLORS.length];
    });
    return colors;
  }, [accountsWithIncome]);

  const chartConfig = useMemo(() => {
    const config: ChartConfig = {
      total: {
        label: '$',
        color: CHART_COLORS[0],
      }
    };

    accountsWithIncome.forEach(({ account }, index) => {
      config[account.name] = {
        label: '$',
        color: CHART_COLORS[index % CHART_COLORS.length],
      };
    });

    return config;
  }, [accountsWithIncome]);

  // Helper function to find the most recent accumulated value for an account on or before a specific date
  function findMostRecentValue(
    accountName: string, 
    targetDate: string, 
    accountData: Record<string, Record<string, number>>,
    allDates: string[]
  ): number {
    // If there's a value for exactly this date, use it
    if (accountData[accountName][targetDate] !== undefined) {
      return accountData[accountName][targetDate];
    }
    
    // Otherwise find the most recent previous date with a value
    const index = allDates.indexOf(targetDate);
    if (index > 0) {
      for (let i = index - 1; i >= 0; i--) {
        const prevDate = allDates[i];
        if (accountData[accountName][prevDate] !== undefined) {
          return accountData[accountName][prevDate];
        }
      }
    }
    
    // If no previous value exists, return 0
    return 0;
  }

  const aggregatedChartData = useMemo(() => {
    if (accountsWithIncome.length === 0) return [];
    
    // Track all dates across all accounts
    const allDatesSet = new Set<string>();
    accountsWithIncome.forEach(({ incomeData }) => {
      incomeData.forEach(income => {
        const date = format(new Date(income.time), 'yyyy-MM-dd');
        allDatesSet.add(date);
      });
    });
    
    // Sort dates chronologically
    const allDates = Array.from(allDatesSet).sort();
    
    // Create a record of accumulated income for each account
    const accountAccumulated: Record<string, Record<string, number>> = {};
    accountsWithIncome.forEach(({ account }) => {
      accountAccumulated[account.name] = {};
    });

    // Calculate accumulated income by date for each account
    accountsWithIncome.forEach(({ account, incomeData }) => {
      let accumulated = 0;
      
      // Sort income data by date
      const sortedIncomeData = [...incomeData].sort((a, b) => a.time - b.time);
      
      // Process each income item
      sortedIncomeData.forEach(income => {
        const date = format(new Date(income.time), 'yyyy-MM-dd');
        accumulated += parseFloat(income.income);
        accountAccumulated[account.name][date] = accumulated;
      });
    });
    
    // Create chart data with an entry for each date and accumulated values for each account
    const chartData = allDates.map(date => {
      const dataPoint: Record<string, any> = {
        date,
        displayDate: format(new Date(date), 'MMM dd, yyyy'),
        total: 0,
      };
      
      // Add accumulated value for each account at this date
      accountsWithIncome.forEach(({ account }) => {
        // Find the most recent accumulated value on or before this date
        const accValue = findMostRecentValue(account.name, date, accountAccumulated, allDates);
        dataPoint[account.name] = accValue;
        dataPoint.total += accValue;
      });
      
      return dataPoint;
    });
    
    return chartData;
  }, [accountsWithIncome]);

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (aggregatedChartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Income Over Time</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 text-center">
          <p>No income data available from any accounts.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle>Combined Income Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-96 aspect-auto" config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={aggregatedChartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <defs>
              {/* Create gradient fill for total line */}
              <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={CHART_COLORS[0]}
                  stopOpacity={0.7}
                />
                <stop
                  offset="70%"
                  stopColor={CHART_COLORS[0]}
                  stopOpacity={0.1}
                />
              </linearGradient>
              
              {/* Create gradient fills for each account */}
              {accountsWithIncome.map(({ account }, index) => (
                <linearGradient
                  key={`fill-${account.name}`}
                  id={`fill-${account.name}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={CHART_COLORS[index % CHART_COLORS.length]}
                    stopOpacity={0.7}
                  />
                  <stop
                    offset="70%"
                    stopColor={CHART_COLORS[index % CHART_COLORS.length]}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              ))}
            </defs>
            
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="displayDate"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 6)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent />}
            />
            
            {/* Total line on top */}
            <Area
              dataKey="total"
              type="monotone"
              stroke={CHART_COLORS[0]}
              fill="url(#fillTotal)"
              fillOpacity={0.7}
              strokeWidth={2}
            />
            
            {/* Individual account lines */}
            {accountsWithIncome.map(({ account }, index) => (
              <Area
                key={account.name}
                dataKey={account.name}
                type="monotone"
                stroke={CHART_COLORS[index % CHART_COLORS.length]}
                fill={`url(#fill-${account.name})`}
                fillOpacity={0.5}
                strokeWidth={1.5}
              />
            ))}
            
            <Legend />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
