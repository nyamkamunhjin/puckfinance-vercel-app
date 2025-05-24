"use client";
import React, { FC, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { AuthGuard } from "../../components/auth-guard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Balance,
	getBalance,
	PositionRisk,
	getCurrentPosition,
} from "@/lib/binance";
import { TradeAccount, getTradeAccounts } from "@/lib/trade-accounts";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import CombinedIncomeTabs from "../../components/CombinedIncomeTabs";
import MonthlyPnLCards from "../../components/MonthlyPnLCards";

interface AccountWithBalance extends TradeAccount {
	balance?: Balance;
	positions?: PositionRisk[];
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

				// Fetch balances and positions for all accounts
				const accountsWithData = await Promise.all(
					data.map(async (account) => {
						try {
							const balance = await getBalance(account.id, session.accessToken);
							const positions = await getCurrentPosition(
								account.id,
								session.accessToken
							);

							console.log(positions);

							// Filter out positions with zero amount
							const activePositions = positions.filter(
								(position) => parseFloat(position.positionAmt) !== 0
							);

							return {
								...account,
								balance,
								positions: activePositions,
							};
						} catch (err) {
							console.error(
								`Failed to fetch data for account ${account.id}:`,
								err
							);
							return account;
						}
					})
				);

				setAccounts(accountsWithData);
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

	// Get all active positions across all accounts
	const getAllPositions = () => {
		const allPositions: Array<{ accountName: string; position: PositionRisk }> =
			[];

		accounts.forEach((account) => {
			if (account.positions && account.positions.length > 0) {
				account.positions.forEach((position) => {
					allPositions.push({
						accountName: account.name,
						position,
					});
				});
			}
		});

		// Sort by unrealized profit (descending)
		return allPositions.sort(
			(a, b) =>
				parseFloat(b.position.unrealizedProfit) -
				parseFloat(a.position.unrealizedProfit)
		);
	};

	// Format currency value
	const formatCurrency = (value: string) => {
		const numValue = parseFloat(value);
		return numValue.toLocaleString(undefined, {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
	};

	// Calculate position size in USD
	const getPositionValueUSD = (position: PositionRisk) => {
		const positionAmt = parseFloat(position.positionAmt);
		const positionInitialMargin = parseFloat(position.positionInitialMargin);
		return Math.abs(positionAmt * positionInitialMargin);
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
							<CardTitle className="text-sm font-medium">
								Total Balance
							</CardTitle>
						</CardHeader>
						<CardContent>
							{loading ? (
								<Skeleton className="h-7 w-[120px]" />
							) : (
								<div className="text-2xl font-bold">
									$
									{getTotalBalance().toLocaleString(undefined, {
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
									$
									{getTotalUnrealizedPnL().toLocaleString(undefined, {
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
								Active Accounts
							</CardTitle>
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

				{/* Current Positions Table */}
				<Card className="bg-background/60 backdrop-blur-sm border-primary/10 hover:shadow-md hover:border-primary/20 transition-all">
					<CardHeader>
						<CardTitle>Current Positions</CardTitle>
					</CardHeader>
					<CardContent>
						{loading ? (
							<div className="space-y-3">
								<Skeleton className="h-6 w-full" />
								<Skeleton className="h-20 w-full" />
							</div>
						) : (
							<div className="rounded-md border">
								<Table>
									<TableCaption className="m-2">
										A list of all current positions across your accounts
									</TableCaption>
									<TableHeader>
										<TableRow>
											<TableHead>Account</TableHead>
											<TableHead>Symbol</TableHead>
											<TableHead>Side</TableHead>
											<TableHead>Size</TableHead>
											<TableHead className="text-right">Entry Price</TableHead>
											<TableHead className="text-right">
												Break Even Price
											</TableHead>
											<TableHead className="text-right">
												Stoploss Price / $Amount
											</TableHead>
											<TableHead className="text-right">
												Takeprofit Price / $Amount
											</TableHead>
											<TableHead className="text-right">
												Unrealized PnL
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{getAllPositions().length === 0 ? (
											<TableRow>
												<TableCell
													colSpan={8}
													className="h-24 text-center text-muted-foreground"
												>
													No active positions found
												</TableCell>
											</TableRow>
										) : (
											getAllPositions().map((item, index) => (
												<TableRow
													key={`${item.accountName}-${item.position.symbol}-${index}`}
												>
													<TableCell className="font-medium">
														{item.accountName}
													</TableCell>
													<TableCell>{item.position.symbol}</TableCell>
													<TableCell>
														<span
															className={
																parseFloat(item.position.positionAmt) > 0
																	? "text-green-600 font-medium"
																	: "text-red-600 font-medium"
															}
														>
															{parseFloat(item.position.positionAmt) > 0
																? "LONG"
																: "SHORT"}
														</span>
													</TableCell>
													<TableCell>
														{parseFloat(item.position.positionAmt).toFixed(4)}
													</TableCell>
													<TableCell className="text-right font-mono">
														{formatCurrency(item.position.entryPrice)}
													</TableCell>
													<TableCell className="text-right font-mono">
														{formatCurrency(item.position.breakEvenPrice)}
													</TableCell>
													<TableCell className="text-right font-mono">
														<div className="flex flex-row gap-1 w-full justify-end">
															<span>
																{formatCurrency(item.position.stoploss)}
															</span>
															/
															<span
																className={`${
																	item.position.stoplossAmount > 0
																		? "text-green-600"
																		: "text-red-600"
																}`}
															>
																(
																{formatCurrency(
																	item.position.stoplossAmount.toFixed(2)
																)}
																)
															</span>
														</div>
													</TableCell>
													<TableCell className="text-right font-mono">
														<div className="flex flex-row gap-1 w-full justify-end">
															<span>
																{formatCurrency(item.position.takeprofit)}
															</span>
															/
															<span
																className={`${
																	item.position.takeprofitAmount > 0
																		? "text-green-600"
																		: "text-red-600"
																}`}
															>
																(
																{formatCurrency(
																	item.position.takeprofitAmount.toFixed(2)
																)}
																)
															</span>
														</div>
													</TableCell>
													<TableCell
														className={`text-right font-mono ${
															parseFloat(item.position.unrealizedProfit) >= 0
																? "text-green-600"
																: "text-red-600"
														}`}
													>
														${formatCurrency(item.position.unrealizedProfit)}
													</TableCell>
												</TableRow>
											))
										)}
									</TableBody>
								</Table>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Monthly PnL Cards */}
				<MonthlyPnLCards 
					accounts={accounts} 
					accessToken={session?.accessToken} 
				/>

				<CombinedIncomeTabs />
			</div>
		</AuthGuard>
	);
};

export default DashboardPage;
