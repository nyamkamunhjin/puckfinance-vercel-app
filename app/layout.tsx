import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";
import { AppHeader } from "@/components/app-header";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
	variable: "--font-space-grotesk",
	subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
	variable: "--font-jetbrains-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "PuckFinance | Crypto Trading Strategy Automation",
	description:
		"Connect TradingView strategies to exchanges, manage your crypto trading portfolio, and monitor performance all in one powerful platform.",
};

	export default function RootLayout({
		children,
	}: Readonly<{
		children: React.ReactNode;
	}>) {
		return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}
			>
				<AuthProvider>
					<div className="min-h-screen bg-background flex flex-col">
						<AppHeader />
						{children}
					</div>
				</AuthProvider>
			</body>
		</html>
		);
	}
