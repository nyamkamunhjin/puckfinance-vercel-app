"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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
	TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TradeHistoryItem, getTradeHistory } from "@/lib/binance";

export default function TradeHistoryPage() {
	const { id } = useParams();
	const { data: session } = useSession();
	const [tradeHistory, setTradeHistory] = useState<TradeHistoryItem[]>([]);
	const [symbol, setSymbol] = useState("BTCUSDT");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchTradeHistory = async () => {
		if (!session?.accessToken || !id) return;

		try {
			setLoading(true);
			setError(null);
			const data = await getTradeHistory(
				id as string,
				symbol,
				session.accessToken
			);
			setTradeHistory(data);
		} catch (err: any) {
			console.error(err);
			setError(err.message || "Failed to fetch trade history");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (session?.accessToken && id) {
			fetchTradeHistory();
		}
	}, [session, id]);

	const handleSymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSymbol(e.target.value.toUpperCase());
	};

	const formatDate = (timestamp: number) => {
		return new Date(timestamp).toLocaleString();
	};

	return (
		<AuthGuard>
			<main className="flex-1 w-full max-w-[2000px] mx-auto px-4 md:px-6 lg:px-8 py-6">
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
					<h1 className="text-3xl font-bold tracking-tight">Trade History</h1>

					<div className="flex items-center gap-2 w-full md:w-auto">
						<Input
							placeholder="Symbol (e.g. BTCUSDT)"
							value={symbol}
							onChange={handleSymbolChange}
							className="max-w-xs"
						/>
						<Button onClick={fetchTradeHistory} disabled={loading}>
							{loading ? "Loading..." : "Fetch"}
						</Button>
					</div>
				</div>

				{error && (
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
						{error}
					</div>
				)}

				<Card>
					<CardHeader>
						<CardTitle>Trade History for {symbol}</CardTitle>
					</CardHeader>
					<CardContent>
						{loading ? (
							<div className="flex justify-center py-12">
								<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
							</div>
						) : tradeHistory.length === 0 ? (
							<p className="text-center py-4">
								No trade history found for {symbol}
							</p>
						) : (
							<div className="overflow-x-auto">
								<Table>
									<TableCaption>Trade history for {symbol}</TableCaption>
									<TableHeader>
										<TableRow>
											<TableHead>Time</TableHead>
											<TableHead>Side</TableHead>
											<TableHead>Price</TableHead>
											<TableHead>Quantity</TableHead>
											<TableHead>Quote Quantity</TableHead>
											<TableHead>Commission</TableHead>
											<TableHead>Type</TableHead>
											<TableHead>Realized PnL</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{tradeHistory.map((trade) => (
											<TableRow key={trade.id}>
												<TableCell>{formatDate(trade.time)}</TableCell>
												<TableCell
													className={
														trade.side === "BUY"
															? "text-green-600"
															: "text-red-600"
													}
												>
													{trade.side}
												</TableCell>
												<TableCell>
													{parseFloat(trade.price).toFixed(2)}
												</TableCell>
												<TableCell>
													{parseFloat(trade.qty).toFixed(4)}
												</TableCell>
												<TableCell>
													{parseFloat(trade.quoteQty).toFixed(2)}
												</TableCell>
												<TableCell>
													{parseFloat(trade.commission).toFixed(8)}{" "}
													{trade.commissionAsset}
												</TableCell>
												<TableCell>
													{trade.isMaker ? "MAKER" : "TAKER"}
												</TableCell>
												<TableCell>
													{trade.realizedPnl ? (
														<span
															className={
																parseFloat(trade.realizedPnl) >= 0
																	? "text-green-600"
																	: "text-red-600"
															}
														>
															{parseFloat(trade.realizedPnl) >= 0 ? "+" : ""}
															{parseFloat(trade.realizedPnl).toFixed(2)} USDT
														</span>
													) : (
														"-"
													)}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						)}
					</CardContent>
				</Card>
			</main>
		</AuthGuard>
	);
}
