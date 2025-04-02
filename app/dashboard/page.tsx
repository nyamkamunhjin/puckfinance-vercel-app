'use client'
import React, { FC, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { AuthGuard } from "../../components/auth-guard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Balance, getBalance } from "@/lib/binance";
import { TradeAccount, getTradeAccounts } from "@/lib/trade-accounts";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface AccountWithBalance extends TradeAccount {
	balance?: Balance;
}

/**
 * @author
 * @function @DashboardPage
 **/

const DashboardPage: FC = () => {
	const { data: session } = useSession();
	const [accounts, setAccounts] = useState<AccountWithBalance[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchAccounts = async () => {
			if (!session?.accessToken) return;

			try {
				setLoading(true);
				const data = await getTradeAccounts(session.accessToken);

				// Fetch balances for all accounts
				const accountsWithBalances = await Promise.all(
					data.map(async (account) => {
						try {
							const balance = await getBalance(account.id, session.accessToken);
							return { ...account, balance };
						} catch (err) {
							console.error(
								`Failed to fetch balance for account ${account.id}:`,
								err
							);
							return account;
						}
					})
				);

				setAccounts(accountsWithBalances);
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

	const getTotalBalance = () => {
		return accounts.reduce((total, account) => {
			if (account.balance) {
				return total + parseFloat(account.balance.balance);
			}
			return total;
		}, 0);
	};

	const getTotalUnrealizedPnL = () => {
		return accounts.reduce((total, account) => {
			if (account.balance) {
				return total + parseFloat(account.balance.crossUnPnl);
			}
			return total;
		}, 0);
	};

	return (
		<AuthGuard>
			<div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
				<div className="flex items-center justify-between">
					<h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
				</div>

				{error && (
					<Alert variant="destructive">
						<ExclamationTriangleIcon className="h-4 w-4" />
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					<Card className="bg-background/60 backdrop-blur-sm border-primary/10 hover:shadow-md hover:border-primary/20 transition-all">
						<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
							<CardTitle className="text-sm font-medium">Total Balance</CardTitle>
						</CardHeader>
						<CardContent>
							{loading ? (
								<Skeleton className="h-7 w-[120px]" />
							) : (
								<div className="text-2xl font-bold">
									${getTotalBalance().toLocaleString(undefined, {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}
								</div>
							)}
						</CardContent>
					</Card>

					<Card className="bg-background/60 backdrop-blur-sm border-primary/10 hover:shadow-md hover:border-primary/20 transition-all">
						<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
							<CardTitle className="text-sm font-medium">
								Total Unrealized PnL
							</CardTitle>
						</CardHeader>
						<CardContent>
							{loading ? (
								<Skeleton className="h-7 w-[120px]" />
							) : (
								<div
									className={`text-2xl font-bold ${
										getTotalUnrealizedPnL() >= 0
											? "text-green-600"
											: "text-red-600"
									}`}
								>
									${getTotalUnrealizedPnL().toLocaleString(undefined, {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})}
								</div>
							)}
						</CardContent>
					</Card>

					<Card className="bg-background/60 backdrop-blur-sm border-primary/10 hover:shadow-md hover:border-primary/20 transition-all">
						<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
							<CardTitle className="text-sm font-medium">
								Connected Accounts
							</CardTitle>
						</CardHeader>
						<CardContent>
							{loading ? (
								<Skeleton className="h-7 w-[120px]" />
							) : (
								<div className="text-2xl font-bold">{accounts.length}</div>
							)}
						</CardContent>
					</Card>

					<Card className="bg-background/60 backdrop-blur-sm border-primary/10 hover:shadow-md hover:border-primary/20 transition-all">
						<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
							<CardTitle className="text-sm font-medium">Active Accounts</CardTitle>
						</CardHeader>
						<CardContent>
							{loading ? (
								<Skeleton className="h-7 w-[120px]" />
							) : (
								<div className="text-2xl font-bold">
									{accounts.filter((a) => a.balance).length}
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</AuthGuard>
	);
};

export default DashboardPage;
