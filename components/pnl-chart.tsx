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
  "oklch(0.75 0.22 250)", // Blue
  "oklch(0.78 0.22 40)",  // Orange
  "oklch(0.7 0.22 135)",  // Green
  "oklch(0.7 0.22 320)",  // Magenta
  "oklch(0.7 0.22 80)",   // Yellow-Green
  "oklch(0.7 0.22 10)",   // Red
];

interface PnlChartProps {
  aggregatedChartData?: Array<Record<string, any>>;
}

export default function PnlChart({ aggregatedChartData }: PnlChartProps) {
  const { data: session } = useSession();
  const [accountsWithIncome, setAccountsWithIncome] = useState<AccountWithIncome[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // If aggregatedChartData is provided, skip fetching and use it directly
  const shouldFetch = !aggregatedChartData;

  useEffect(() => {
    if (!shouldFetch) return;
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
  }, [session, shouldFetch]);

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

  // If using provided data, skip loading/error states
  if (aggregatedChartData !== undefined) {
    const safeData = aggregatedChartData ?? [];
    if (safeData.length === 0) {
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
              data={safeData}
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
                {Object.keys(safeData[0] || {})
                  .filter((key) => key !== "date" && key !== "displayDate" && key !== "total")
                  .map((accountName, index) => (
                    <linearGradient
                      key={`fill-${accountName}`}
                      id={`fill-${accountName}`}
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
              <Area
                dataKey="total"
                type="monotone"
                stroke={CHART_COLORS[0]}
                fill="url(#fillTotal)"
                fillOpacity={0.7}
                strokeWidth={2}
              />
              {Object.keys(safeData[0] || {})
                .filter((key) => key !== "date" && key !== "displayDate" && key !== "total")
                .map((accountName, index) => (
                  <Area
                    key={accountName}
                    dataKey={accountName}
                    type="monotone"
                    stroke={CHART_COLORS[index % CHART_COLORS.length]}
                    fill={`url(#fill-${accountName})`}
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
