"use client";
import React, { FC, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getIncome, Income } from "@/lib/binance";
import { TradeAccount } from "@/lib/trade-accounts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface MonthlyPnLCardsProps {
  accounts: TradeAccount[];
  accessToken?: string;
}

interface AccountMonthlyPnL {
  accountId: string;
  accountName: string;
  monthlyPnL: number;
  loading: boolean;
  error?: string;
}

const MonthlyPnLCards: FC<MonthlyPnLCardsProps> = ({ accounts, accessToken }) => {
  const [accountsPnL, setAccountsPnL] = useState<AccountMonthlyPnL[]>([]);

  // Get current month's start and end timestamps
  const getCurrentMonthRange = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    
    return {
      startTime: startOfMonth.getTime(),
      endTime: endOfMonth.getTime()
    };
  };

  // Calculate monthly PnL from income data
  const calculateMonthlyPnL = (incomeData: Income[]) => {
    const { startTime, endTime } = getCurrentMonthRange();
    
    return incomeData
      .filter(income => {
        const incomeTime = income.time;
        return incomeTime >= startTime && incomeTime <= endTime;
      })
      .filter(income => {
        // Focus on PnL-related income types
        const pnlIncomeTypes = [
          'REALIZED_PNL',
          'FUNDING_FEE',
          'COMMISSION',
          'INSURANCE_CLEAR',
          'REFERRAL_KICKBACK',
          'COMMISSION_DISCOUNT',
          'FEE_BURN'
        ];
        return pnlIncomeTypes.includes(income.incomeType);
      })
      .reduce((total, income) => {
        return total + parseFloat(income.income);
      }, 0);
  };

  // Format currency value
  const formatCurrency = (value: number) => {
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Get current month name
  const getCurrentMonthName = () => {
    const now = new Date();
    return now.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  useEffect(() => {
    const fetchMonthlyPnL = async () => {
      if (!accessToken || accounts.length === 0) return;

      // Initialize loading state for all accounts
      const initialState = accounts.map(account => ({
        accountId: account.id,
        accountName: account.name,
        monthlyPnL: 0,
        loading: true,
      }));
      setAccountsPnL(initialState);

      // Fetch PnL for each account
      const updatedAccountsPnL = await Promise.all(
        accounts.map(async (account) => {
          try {
            const incomeData = await getIncome(account.id, accessToken);
            const monthlyPnL = calculateMonthlyPnL(incomeData);

            return {
              accountId: account.id,
              accountName: account.name,
              monthlyPnL,
              loading: false,
            };
          } catch (error: any) {
            console.error(`Failed to fetch income for account ${account.id}:`, error);
            return {
              accountId: account.id,
              accountName: account.name,
              monthlyPnL: 0,
              loading: false,
              error: error.message || "Failed to fetch income data",
            };
          }
        })
      );

      setAccountsPnL(updatedAccountsPnL);
    };

    fetchMonthlyPnL();
  }, [accounts, accessToken]);

  // Calculate total monthly PnL across all accounts
  const getTotalMonthlyPnL = () => {
    return accountsPnL
      .filter(account => !account.error)
      .reduce((total, account) => total + account.monthlyPnL, 0);
  };

  if (accounts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Monthly PnL - {getCurrentMonthName()}</h3>
      </div>

      {/* Total Monthly PnL Card */}
      <Card className="bg-background/60 backdrop-blur-sm border-primary/10 hover:shadow-md hover:border-primary/20 transition-all">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">
            Total Monthly PnL
          </CardTitle>
        </CardHeader>
        <CardContent>
          {accountsPnL.some(account => account.loading) ? (
            <Skeleton className="h-7 w-[120px]" />
          ) : (
            <div
              className={`text-2xl font-bold ${
                getTotalMonthlyPnL() >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              ${formatCurrency(getTotalMonthlyPnL())}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Individual Account Monthly PnL Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {accountsPnL.map((account) => (
          <Card
            key={account.accountId}
            className="bg-background/60 backdrop-blur-sm border-primary/10 hover:shadow-md hover:border-primary/20 transition-all"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium truncate">
                {account.accountName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {account.loading ? (
                <Skeleton className="h-7 w-[100px]" />
              ) : account.error ? (
                <Alert variant="destructive" className="p-2">
                  <ExclamationTriangleIcon className="h-3 w-3" />
                  <AlertDescription className="text-xs">
                    {account.error}
                  </AlertDescription>
                </Alert>
              ) : (
                <div
                  className={`text-xl font-bold ${
                    account.monthlyPnL >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ${formatCurrency(account.monthlyPnL)}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MonthlyPnLCards; 