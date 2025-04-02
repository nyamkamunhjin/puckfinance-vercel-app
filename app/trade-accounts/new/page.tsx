"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AuthGuard } from "@/components/auth-guard";
import { createTradeAccount, Provider } from "@/lib/trade-accounts";
import Link from "next/link";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function NewTradeAccountPage() {
	const router = useRouter();
	const { data: session } = useSession();
	const [name, setName] = useState("");
	const [apiKey, setApiKey] = useState("");
	const [secretKey, setSecretKey] = useState("");
	const [provider, setProvider] = useState<Provider>("BINANCE");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!session?.accessToken) {
			setError("Not authenticated");
			return;
		}

		setError(null);
		setLoading(true);

		try {
			await createTradeAccount(
				{
					name,
					apiKey,
					secretKey,
					provider,
				},
				session.accessToken
			);
			router.push("/trade-accounts");
		} catch (err: any) {
			setError(err.message || "Failed to create trade account");
			setLoading(false);
		}
	};

	return (
		<AuthGuard>
			<main className="flex-1 w-full max-w-[2000px] mx-auto px-4 md:px-6 lg:px-8 py-6">
				<div className="max-w-2xl mx-auto">
					<div className="flex justify-between items-center mb-6">
						<h1 className="text-3xl font-bold tracking-tight">
							Add Trade Account
						</h1>
						<Button variant="outline" asChild>
							<Link href="/trade-accounts">Back to Accounts</Link>
						</Button>
					</div>

					<Card>
						<CardHeader>
							<CardTitle>New Trade Account</CardTitle>
						</CardHeader>
						<CardContent>
							{error && (
								<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
									{error}
								</div>
							)}

							<form
								onSubmit={handleSubmit}
								id="new-account-form"
								className="space-y-6"
							>
								<div className="grid gap-4">
									<div className="grid gap-2">
										<label htmlFor="name" className="text-sm font-medium">
											Account Name
										</label>
										<input
											type="text"
											id="name"
											value={name}
											onChange={(e) => setName(e.target.value)}
											required
											className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
											placeholder="My Binance Account"
										/>
									</div>

									<div className="grid gap-2">
										<label htmlFor="provider" className="text-sm font-medium">
											Provider
										</label>
										<select
											id="provider"
											value={provider}
											onChange={(e) => setProvider(e.target.value as Provider)}
											required
											className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
										>
											<option value="BINANCE">Binance</option>
											<option value="BYBIT">ByBit</option>
											<option value="OKEX">OKEx</option>
										</select>
									</div>

									<div className="grid gap-2">
										<label htmlFor="apiKey" className="text-sm font-medium">
											API Key
										</label>
										<input
											type="text"
											id="apiKey"
											value={apiKey}
											onChange={(e) => setApiKey(e.target.value)}
											required
											className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-mono"
											placeholder="Your API Key"
										/>
									</div>

									<div className="grid gap-2">
										<label htmlFor="secretKey" className="text-sm font-medium">
											Secret Key
										</label>
										<input
											type="password"
											id="secretKey"
											value={secretKey}
											onChange={(e) => setSecretKey(e.target.value)}
											required
											className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-mono"
											placeholder="Your Secret Key"
										/>
									</div>
								</div>
							</form>
						</CardContent>
						<CardFooter className="flex justify-end gap-2">
							<Button
								variant="outline"
								onClick={() => router.push("/trade-accounts")}
							>
								Cancel
							</Button>
							<Button type="submit" form="new-account-form" disabled={loading}>
								{loading ? "Creating..." : "Create Account"}
							</Button>
						</CardFooter>
					</Card>
				</div>
			</main>
		</AuthGuard>
	);
}
