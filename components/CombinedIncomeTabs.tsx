import React, { useState, useEffect, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PnlTable from "./pnl-table";
import PnlChart from "./pnl-chart";
import TradingCalendar from "./trading-calendar";
import CommissionTable from './commision-table';
import { useSession } from "next-auth/react";
import { Income, getIncome } from "@/lib/binance";
import { TradeAccount, getTradeAccounts } from "@/lib/trade-accounts";
import { format } from "date-fns";
import { Card, CardContent } from "./ui/card";

interface AccountWithIncome {
  account: TradeAccount;
  incomeData: Income[];
}

const CombinedIncomeTabs: React.FC = () => {
  // Pagination state for the table
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // Data fetching and aggregation (lifted from PnlChart)
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

  // Helper function to find the most recent accumulated value for an account on or before a specific date
  function findMostRecentValue(
    accountName: string,
    targetDate: string,
    accountData: Record<string, Record<string, number>>,
    allDates: string[]
  ): number {
    if (accountData[accountName][targetDate] !== undefined) {
      return accountData[accountName][targetDate];
    }
    const index = allDates.indexOf(targetDate);
    if (index > 0) {
      for (let i = index - 1; i >= 0; i--) {
        const prevDate = allDates[i];
        if (accountData[accountName][prevDate] !== undefined) {
          return accountData[accountName][prevDate];
        }
      }
    }
    return 0;
  }

  // Aggregated chart data (same as in PnlChart)
  const aggregatedChartData = useMemo(() => {
    if (accountsWithIncome.length === 0) return [];
    const allDatesSet = new Set<string>();
    accountsWithIncome.forEach(({ incomeData }) => {
      incomeData.forEach(income => {
        const date = format(new Date(income.time), 'yyyy-MM-dd');
        allDatesSet.add(date);
      });
    });
    const allDates = Array.from(allDatesSet).sort();
    const accountAccumulated: Record<string, Record<string, number>> = {};
    accountsWithIncome.forEach(({ account }) => {
      accountAccumulated[account.name] = {};
    });
    accountsWithIncome.forEach(({ account, incomeData }) => {
      let accumulated = 0;
      const sortedIncomeData = [...incomeData].sort((a, b) => a.time - b.time);
      sortedIncomeData.forEach(income => {
        const date = format(new Date(income.time), 'yyyy-MM-dd');
        accumulated += parseFloat(income.income);
        accountAccumulated[account.name][date] = accumulated;
      });
    });
    const chartData = allDates.map(date => {
      const dataPoint: Record<string, any> = {
        date,
        displayDate: format(new Date(date), 'MMM dd, yyyy'),
        total: 0,
      };
      accountsWithIncome.forEach(({ account }) => {
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

  return (
      <Tabs defaultValue="table" className="w-full">
          <TabsList className="mb-4">
              <TabsTrigger value="table">Combined Income</TabsTrigger>
              <TabsTrigger value="chart">Combined Income Over Time</TabsTrigger>
              <TabsTrigger value="calendar">Trading Calendar</TabsTrigger>
              <TabsTrigger value="commission">Commission</TabsTrigger>
          </TabsList>
          <TabsContent value="table">
              <PnlTable
                  page={page}
                  rowsPerPage={rowsPerPage}
                  onPageChange={setPage}
              />
          </TabsContent>
          <TabsContent value="chart">
              <PnlChart aggregatedChartData={aggregatedChartData} />
          </TabsContent>
          <TabsContent value="calendar">
              <TradingCalendar
                  accountsWithIncome={accountsWithIncome}
                  loading={loading}
                  error={error}
              />
          </TabsContent>
          <TabsContent value="commission">
              <CommissionTable
                  page={page}
                  rowsPerPage={rowsPerPage}
                  onPageChange={setPage}
              />
          </TabsContent>
      </Tabs>
  );
};

export default CombinedIncomeTabs; 