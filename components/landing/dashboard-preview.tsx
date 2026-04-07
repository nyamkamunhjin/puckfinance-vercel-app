"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const trades = [
  { pair: "BTC/USDT", side: "Long", entry: "$64,230", pnl: "+12.4%", status: "Active" },
  { pair: "ETH/USDT", side: "Short", entry: "$3,450", pnl: "+8.1%", status: "Active" },
  { pair: "SOL/USDT", side: "Long", entry: "$145", pnl: "-2.3%", status: "Active" },
];

export function DashboardPreview() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-obsidian py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-white md:text-5xl font-sans">
            Live Performance Monitor
          </h2>
          <p className="mt-4 text-gray-400 font-mono">
            Real-time tracking of your automated strategies.
          </p>
        </div>

        <motion.div
          initial={{ rotateX: 20, rotateY: -10, opacity: 0, y: 100 }}
          whileInView={{ rotateX: 10, rotateY: -5, opacity: 1, y: 0 }}
          whileHover={{ rotateX: 0, rotateY: 0, scale: 1.02 }}
          transition={{ duration: 0.8, type: "spring" }}
          viewport={{ once: true }}
          className="mx-auto max-w-5xl perspective-1000"
          style={{ transformStyle: "preserve-3d" }}
        >
          <Card className="border-white/10 bg-black/40 backdrop-blur-xl">
            <CardHeader className="border-b border-white/5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-white font-sans">Portfolio Overview</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-terminal-green" />
                  <span className="text-xs text-terminal-green font-mono">Live</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-lg border border-white/5 bg-white/5 p-4">
                  <div className="text-sm text-gray-400 font-mono">Net Worth</div>
                  <div className="mt-2 text-2xl font-bold text-white font-mono">$124,592.45</div>
                  <div className="mt-1 text-xs text-terminal-green font-mono">+4.2% (24h)</div>
                </div>
                <div className="rounded-lg border border-white/5 bg-white/5 p-4">
                  <div className="text-sm text-gray-400 font-mono">Active Trades</div>
                  <div className="mt-2 text-2xl font-bold text-white font-mono">8</div>
                  <div className="mt-1 text-xs text-terminal-green font-mono">3 Executing</div>
                </div>
                <div className="rounded-lg border border-white/5 bg-white/5 p-4">
                  <div className="text-sm text-gray-400 font-mono">Total Profit</div>
                  <div className="mt-2 text-2xl font-bold text-white font-mono">$12,450.00</div>
                  <div className="mt-1 text-xs text-terminal-green font-mono">All Time</div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="mb-4 text-sm font-semibold text-gray-400 font-mono">Recent Activity</h3>
                <div className="rounded-lg border border-white/5 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-white/5">
                      <TableRow className="border-white/5 hover:bg-white/5">
                        <TableHead className="text-gray-400 font-mono">Pair</TableHead>
                        <TableHead className="text-gray-400 font-mono">Side</TableHead>
                        <TableHead className="text-gray-400 font-mono">Entry</TableHead>
                        <TableHead className="text-gray-400 font-mono">PnL</TableHead>
                        <TableHead className="text-right text-gray-400 font-mono">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {trades.map((trade) => (
                        <TableRow key={trade.pair} className="border-white/5 hover:bg-white/5 transition-colors">
                          <TableCell className="font-medium text-white font-mono">{trade.pair}</TableCell>
                          <TableCell>
                            <span className={cn(
                              "rounded px-2 py-1 text-xs font-mono",
                              trade.side === "Long" ? "bg-terminal-green/20 text-terminal-green" : "bg-red-500/20 text-red-500"
                            )}>
                              {trade.side}
                            </span>
                          </TableCell>
                          <TableCell className="text-gray-300 font-mono">{trade.entry}</TableCell>
                          <TableCell className={cn("font-mono", trade.pnl.startsWith("+") ? "text-terminal-green" : "text-red-500")}>
                            {trade.pnl}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-terminal-green animate-pulse" />
                              <span className="text-gray-300 font-mono">{trade.status}</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
