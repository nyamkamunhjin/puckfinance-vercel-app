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
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
	Balance,
	Income,
	Snapshot,
	getBalance,
	getIncome,
	getSnapshots,
} from "@/lib/binance";
import { CardChart } from "@/components/ui/card-chart";
import { subDays } from "date-fns";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import ProfitChart from "../../../../components/profit-chart";
import { Input } from "../../../../components/ui/input";

const ITEMS_PER_PAGE = 10;

export default function TradeAccountDashboard() {
	const { id } = useParams();
	const router = useRouter();
	const { data: session } = useSession();
	const [balance, setBalance] = useState<Balance | null>(null);
	const [income, setIncome] = useState<Income[]>([]);
	const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);

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
		return parseFloat(balance.balance).toFixed(2);
	};

	const getTotalUnrealizedPnL = () => {
		if (!balance) return "0.00";

		// For simplicity, we're assuming asset is USDT which is 1:1 with USD
		return parseFloat(balance.crossUnPnl).toFixed(2);
	};

	// Calculate pagination values
	const totalItems = income.length;
	const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const endIndex = startIndex + ITEMS_PER_PAGE;
	const currentItems = income
		.sort((a, b) => b.time - a.time)
		.slice(startIndex, endIndex);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	return (
		<AuthGuard>
			<main className="flex-1 w-full max-w-[2000px] mx-auto px-4 md:px-6 lg:px-8 py-6">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold tracking-tight">
						Account Dashboard
					</h1>
					<div className="flex gap-2">
						<Button variant="outline" asChild>
							<Link href={`/trade-accounts/${id}/trade-history`}>
								Trade History
							</Link>
						</Button>
						<Button variant="outline" asChild>
							<Link href={`/trade-accounts/${id}`}>Edit Account</Link>
						</Button>
						<Button variant="outline" asChild>
							<Link href="/trade-accounts">All Accounts</Link>
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
						<div className="grid grid-cols-1 gap-6">
							<Card>
								<CardHeader>
									<CardTitle>Entry webhook link</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="flex items-center gap-2">
										<span className="text-sm font-medium border border-gray-400 rounded-md p-2">{`${process.env.NEXT_PUBLIC_API_URL}/api/binance/entry/${id}?api_key=munkhjinbnoo`}</span>
										<Button
											variant="outline"
											className=""
											onClick={() =>
												navigator.clipboard.writeText(
													`${process.env.NEXT_PUBLIC_API_URL}/api/binance/entry/${id}?api_key=munkhjinbnoo`
												)
											}
										>
											Copy
										</Button>
									</div>
								</CardContent>
							</Card>
							{/* Account Balance Section */}
							<Card>
								<CardHeader>
									<CardTitle>Account Balance</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="mb-4">
										<div className="text-lg font-semibold">
											Total Balance:
										</div>
										<div className="text-3xl font-bold">
											${getTotalBalance()} USD
										</div>
									</div>

									<div className="mb-4">
										<div className="text-lg font-semibold">
											Total Unrealized PnL:
										</div>
										<div
											className={`text-3xl font-bold ${
												parseFloat(balance?.crossUnPnl || "0") >= 0
													? "text-green-600"
													: "text-red-600"
											}`}
										>
											${getTotalUnrealizedPnL()} USD
										</div>
									</div>

									<div className="overflow-x-auto">
										<Table>
											<TableCaption>Current Balance Details</TableCaption>
											<TableHeader>
												<TableRow>
													<TableHead>Asset</TableHead>
													<TableHead>Total Available Balance</TableHead>
													<TableHead>Available Balance</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{!balance ? (
													<TableRow>
														<TableCell colSpan={3} className="text-center">
															No balance data available
														</TableCell>
													</TableRow>
												) : (
													<TableRow>
														<TableCell className="font-medium">
															{balance.asset}
														</TableCell>
														<TableCell>
															{parseFloat(balance.availableBalance).toFixed(2)}
														</TableCell>
														<TableCell>
															{parseFloat(balance.availableBalance).toFixed(2)}
														</TableCell>
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
									<ProfitChart incomeData={income} />
									<div className="overflow-x-auto">
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead>Time</TableHead>
													<TableHead>Id</TableHead>
													<TableHead>Symbol</TableHead>
													<TableHead>Type</TableHead>
													<TableHead>Amount</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{currentItems.length === 0 ? (
													<TableRow>
														<TableCell colSpan={5} className="text-center">
															No income data available
														</TableCell>
													</TableRow>
												) : (
													currentItems.map((item) => (
														<TableRow key={item.tranId}>
															<TableCell>{formatDate(item.time)}</TableCell>
															<TableCell>{item.info}</TableCell>
															<TableCell>{item.symbol}</TableCell>
															<TableCell>{item.incomeType}</TableCell>
															<TableCell
																className={
																	parseFloat(item.income) >= 0
																		? "text-green-600"
																		: "text-red-600"
																}
															>
																{parseFloat(item.income) >= 0 ? "+" : ""}
																{parseFloat(item.income).toFixed(8)}{" "}
																{item.asset}
															</TableCell>
														</TableRow>
													))
												)}
											</TableBody>
										</Table>
										<Pagination className="mt-4">
											<PaginationContent>
												<PaginationItem>
													<PaginationPrevious
														href="#"
														onClick={(e) => {
															e.preventDefault();
															if (currentPage > 1)
																handlePageChange(currentPage - 1);
														}}
													/>
												</PaginationItem>

												{Array.from({ length: totalPages }, (_, i) => i + 1)
													.filter((page) => {
														// Show first page, last page, and pages around current page
														const nearCurrent =
															Math.abs(page - currentPage) <= 1;
														const isFirstOrLast =
															page === 1 || page === totalPages;
														return nearCurrent || isFirstOrLast;
													})
													.map((page, index, array) => {
														// If there's a gap in the sequence, add ellipsis
														if (index > 0 && page - array[index - 1] > 1) {
															return (
																<PaginationItem key={`ellipsis-${page}`}>
																	<PaginationEllipsis />
																</PaginationItem>
															);
														}

														return (
															<PaginationItem key={page}>
																<PaginationLink
																	href="#"
																	onClick={(e) => {
																		e.preventDefault();
																		handlePageChange(page);
																	}}
																	isActive={page === currentPage}
																>
																	{page}
																</PaginationLink>
															</PaginationItem>
														);
													})}

												<PaginationItem>
													<PaginationNext
														href="#"
														onClick={(e) => {
															e.preventDefault();
															if (currentPage < totalPages)
																handlePageChange(currentPage + 1);
														}}
													/>
												</PaginationItem>
											</PaginationContent>
										</Pagination>
									</div>
								</CardContent>
							</Card>
						</div>
					</>
				)}
			</main>
		</AuthGuard>
	);
}
