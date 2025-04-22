"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { Income, getIncome } from "@/lib/binance";
import { TradeAccount, getTradeAccounts } from "@/lib/trade-accounts";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface AccountWithIncome {
  account: TradeAccount;
  incomeData: Income[];
}

interface AggregatedIncomeItem {
  time: number;
  date: string;
  totalIncome: number;
  incomeByAccount: Record<string, number>;
}

interface PnlTableProps {
  page?: number;
  rowsPerPage?: number;
  onPageChange?: (page: number) => void;
}

export default function PnlTable({ page = 1, rowsPerPage, onPageChange }: PnlTableProps) {
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

  const aggregatedIncomeData = useMemo(() => {
    if (accountsWithIncome.length === 0) return [];

    // Create a map to store income by date across all accounts
    const incomeByDate: Record<string, AggregatedIncomeItem> = {};

    // Process income data from all accounts
    accountsWithIncome.forEach(({ account, incomeData }) => {
      incomeData.forEach((income) => {
        const date = format(new Date(income.time), 'yyyy-MM-dd');
        
        if (!incomeByDate[date]) {
          incomeByDate[date] = {
            time: income.time,
            date,
            totalIncome: 0,
            incomeByAccount: {}
          };
        }
        
        const incomeValue = parseFloat(income.income);
        incomeByDate[date].totalIncome += incomeValue;
        
        if (!incomeByDate[date].incomeByAccount[account.name]) {
          incomeByDate[date].incomeByAccount[account.name] = 0;
        }
        incomeByDate[date].incomeByAccount[account.name] += incomeValue;
      });
    });

    // Convert to array and sort by date (newest first)
    return Object.values(incomeByDate)
      .sort((a, b) => b.time - a.time);
  }, [accountsWithIncome]);

  const totalByAccount = useMemo(() => {
    const totals: Record<string, number> = {};
    accountsWithIncome.forEach(({ account }) => {
      totals[account.name] = 0;
    });

    aggregatedIncomeData.forEach((item) => {
      Object.entries(item.incomeByAccount).forEach(([accountName, income]) => {
        totals[accountName] = (totals[accountName] || 0) + income;
      });
    });

    return totals;
  }, [aggregatedIncomeData, accountsWithIncome]);

  const overallTotal = useMemo(() => {
    return Object.values(totalByAccount).reduce((sum, income) => sum + income, 0);
  }, [totalByAccount]);

  const accountColumns = accountsWithIncome.map(({ account }) => account.name);

  // Pagination logic
  const totalRows = aggregatedIncomeData.length;
  const totalPages = rowsPerPage ? Math.ceil(totalRows / rowsPerPage) : 1;
  const paginatedData = rowsPerPage
    ? aggregatedIncomeData.slice((page - 1) * rowsPerPage, page * rowsPerPage)
    : aggregatedIncomeData;

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

  if (aggregatedIncomeData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Combined Income</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 text-center">
          <p>No income data available from any accounts.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Combined Income</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Table>
          <TableCaption>Income data from all trading accounts</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              {accountColumns.map((name) => (
                <TableHead key={name}>{name}</TableHead>
              ))}
              <TableHead>Daily Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow key={item.date}>
                <TableCell>{format(new Date(item.time), 'MMM dd, yyyy')}</TableCell>
                {accountColumns.map((accountName) => (
                  <TableCell key={accountName} className={item.incomeByAccount[accountName] > 0 ? "text-green-600" : item.incomeByAccount[accountName] < 0 ? "text-red-600" : ""}>
                    {item.incomeByAccount[accountName] 
                      ? `$${item.incomeByAccount[accountName].toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`
                      : '-'}
                  </TableCell>
                ))}
                <TableCell className={item.totalIncome > 0 ? "text-green-600 font-medium" : item.totalIncome < 0 ? "text-red-600 font-medium" : ""}>
                  ${item.totalIncome.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>Total</TableCell>
              {accountColumns.map((accountName) => (
                <TableCell key={`total-${accountName}`} className={totalByAccount[accountName] > 0 ? "text-green-600" : totalByAccount[accountName] < 0 ? "text-red-600" : ""}>
                  ${(totalByAccount[accountName] || 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </TableCell>
              ))}
              <TableCell className={overallTotal > 0 ? "text-green-600 font-bold" : overallTotal < 0 ? "text-red-600 font-bold" : ""}>
                ${overallTotal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        {/* Pagination Controls */}
        {rowsPerPage && totalPages > 1 && onPageChange && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={e => {
                    e.preventDefault();
                    if (page > 1) onPageChange(page - 1);
                  }}
                  aria-disabled={page === 1}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <PaginationItem key={idx}>
                  <PaginationLink
                    href="#"
                    isActive={page === idx + 1}
                    onClick={e => {
                      e.preventDefault();
                      onPageChange(idx + 1);
                    }}
                  >
                    {idx + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={e => {
                    e.preventDefault();
                    if (page < totalPages) onPageChange(page + 1);
                  }}
                  aria-disabled={page === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </CardContent>
    </Card>
  );
}
