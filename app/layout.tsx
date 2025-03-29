import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PuckFinance | Crypto Trading Strategy Automation",
  description: "Connect TradingView strategies to exchanges, manage your crypto trading portfolio, and monitor performance all in one powerful platform.",
  keywords: [
    "crypto trading",
    "trading automation",
    "TradingView integration",
    "Binance",
    "Bybit",
    "portfolio management",
    "trading strategy",
    "crypto exchange",
  ],
  authors: [{ name: "PuckFinance Team" }],
  openGraph: {
    title: "PuckFinance | Crypto Trading Strategy Automation",
    description: "Connect TradingView strategies to exchanges, manage your crypto trading portfolio, and monitor performance all in one powerful platform.",
    url: "https://puckfinance.com",
    siteName: "PuckFinance",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PuckFinance - Automate Your Crypto Trading Strategy",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PuckFinance | Crypto Trading Strategy Automation",
    description: "Connect TradingView strategies to exchanges, manage your crypto trading portfolio, and monitor performance all in one powerful platform.",
    images: ["/twitter-image.png"],
    creator: "@puckfinance",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
