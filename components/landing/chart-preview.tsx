"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const CANDLE_COUNT = 24;
const EQUITY_POINTS = 40;

interface Candle {
    open: number;
    high: number;
    low: number;
    close: number;
    bull: boolean;
}

function generateCandles(): Candle[] {
    const candles: Candle[] = [];
    let price = 62000 + Math.random() * 2000;
    for (let i = 0; i < CANDLE_COUNT; i++) {
        const change = (Math.random() - 0.42) * 800;
        const open = price;
        const close = price + change;
        const high = Math.max(open, close) + Math.random() * 400;
        const low = Math.min(open, close) - Math.random() * 400;
        candles.push({ open, high, low, close, bull: close >= open });
        price = close;
    }
    return candles;
}

function generateEquity(): number[] {
    const pts: number[] = [];
    let val = 10000;
    for (let i = 0; i < EQUITY_POINTS; i++) {
        val += (Math.random() - 0.38) * 600;
        val = Math.max(val, 7000);
        pts.push(val);
    }
    return pts;
}

function CandlestickChart({ className }: { className?: string }) {
    const candles = useMemo(() => generateCandles(), []);
    const w = 560;
    const h = 260;
    const pad = { t: 20, r: 10, b: 30, l: 10 };
    const chartW = w - pad.l - pad.r;
    const chartH = h - pad.t - pad.b;

    const allPrices = candles.flatMap((c) => [c.high, c.low]);
    const minP = Math.min(...allPrices);
    const maxP = Math.max(...allPrices);
    const range = maxP - minP || 1;

    const scaleY = (p: number) => pad.t + chartH - ((p - minP) / range) * chartH;
    const barW = chartW / candles.length;

    return (
        <svg viewBox={`0 0 ${w} ${h}`} className={cn("w-full h-full", className)}>
            <defs>
                <linearGradient id="bullGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#16a34a" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="bearGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#dc2626" stopOpacity="0.9" />
                </linearGradient>
            </defs>
            {candles.map((c, i) => {
                const x = pad.l + i * barW + barW / 2;
                const bodyTop = scaleY(Math.max(c.open, c.close));
                const bodyBot = scaleY(Math.min(c.open, c.close));
                const bodyH = Math.max(bodyBot - bodyTop, 1);
                return (
                    <g key={i}>
                        <motion.line
                            x1={x} x2={x}
                            y1={scaleY(c.high)} y2={scaleY(c.low)}
                            stroke={c.bull ? "#22c55e" : "#ef4444"}
                            strokeWidth="1.5"
                            strokeOpacity="0.7"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 0.4, delay: i * 0.04 }}
                        />
                        <motion.rect
                            x={x - barW * 0.3}
                            y={bodyTop}
                            width={barW * 0.6}
                            height={bodyH}
                            rx="1"
                            fill={c.bull ? "url(#bullGrad)" : "url(#bearGrad)"}
                            initial={{ scaleY: 0, opacity: 0 }}
                            animate={{ scaleY: 1, opacity: 1 }}
                            transition={{ duration: 0.3, delay: i * 0.04 }}
                            style={{ transformOrigin: `${x}px ${bodyBot}px` }}
                        />
                    </g>
                );
            })}
            {candles.slice(-4).map((c, i) => {
                const idx = CANDLE_COUNT - 4 + i;
                const x = pad.l + idx * barW + barW / 2;
                return (
                    <motion.text
                        key={`lbl-${i}`}
                        x={x}
                        y={h - 6}
                        textAnchor="middle"
                        className="fill-muted-foreground text-[9px] font-mono"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        transition={{ delay: 1.5 + i * 0.1 }}
                    >
                        {(c.close / 1000).toFixed(1)}k
                    </motion.text>
                );
            })}
        </svg>
    );
}

function EquityCurve({ className }: { className?: string }) {
    const data = useMemo(() => generateEquity(), []);
    const w = 560;
    const h = 200;
    const pad = { t: 15, r: 10, b: 20, l: 10 };
    const chartW = w - pad.l - pad.r;
    const chartH = h - pad.t - pad.b;

    const minV = Math.min(...data);
    const maxV = Math.max(...data);
    const range = maxV - minV || 1;

    const points = data.map((v, i) => ({
        x: pad.l + (i / (data.length - 1)) * chartW,
        y: pad.t + chartH - ((v - minV) / range) * chartH,
    }));

    const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
    const areaD = `${pathD} L${points[points.length - 1].x},${pad.t + chartH} L${points[0].x},${pad.t + chartH} Z`;

    const finalVal = data[data.length - 1];
    const startVal = data[0];
    const pnlPct = (((finalVal - startVal) / startVal) * 100).toFixed(1);
    const isProfit = finalVal >= startVal;

    return (
        <svg viewBox={`0 0 ${w} ${h}`} className={cn("w-full h-full", className)}>
            <defs>
                <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0.0" />
                </linearGradient>
            </defs>
            {[0.25, 0.5, 0.75].map((pct) => (
                <motion.line
                    key={pct}
                    x1={pad.l}
                    x2={w - pad.r}
                    y1={pad.t + chartH * pct}
                    y2={pad.t + chartH * pct}
                    stroke="currentColor"
                    strokeOpacity="0.06"
                    strokeWidth="1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                />
            ))}
            <motion.path
                d={areaD}
                fill="url(#equityFill)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.5 }}
            />
            <motion.path
                d={pathD}
                fill="none"
                stroke="#22c55e"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 0.2, ease: "easeOut" }}
            />
            <motion.circle
                cx={points[points.length - 1].x}
                cy={points[points.length - 1].y}
                r="4"
                fill="#22c55e"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 2.2, type: "spring" }}
            />
            <motion.circle
                cx={points[points.length - 1].x}
                cy={points[points.length - 1].y}
                r="8"
                fill="none"
                stroke="#22c55e"
                strokeWidth="1"
                strokeOpacity="0.3"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 2.4, type: "spring" }}
            />
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}>
                <text
                    x={w - pad.r}
                    y={pad.t + 8}
                    textAnchor="end"
                    className="fill-emerald-500 text-[11px] font-bold font-mono"
                >
                  +{pnlPct}%
                </text>
                <text
                    x={w - pad.r}
                    y={pad.t + 22}
                    textAnchor="end"
                    className="fill-muted-foreground text-[10px] font-mono"
                >
                  ${finalVal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </text>
            </motion.g>
        </svg>
    );
}

const LIVE_TRADES = [
    { pair: "BTC/USDT", side: "LONG", pnl: "+12.4%", time: "2m ago" },
    { pair: "ETH/USDT", side: "SHORT", pnl: "+8.1%", time: "5m ago" },
    { pair: "SOL/USDT", side: "LONG", pnl: "-2.3%", time: "12m ago" },
    { pair: "DOGE/USDT", side: "LONG", pnl: "+24.8%", time: "18m ago" },
    { pair: "AVAX/USDT", side: "SHORT", pnl: "+5.7%", time: "25m ago" },
];

const STATS = [
    { label: "Win Rate", value: "78%", color: "text-emerald-500" },
    { label: "Total Trades", value: "1,247", color: "text-foreground" },
    { label: "Avg R:R", value: "2.4:1", color: "text-emerald-500" },
];

export function LandingChartPreview({ className }: { className?: string }) {
    const [activeTab, setActiveTab] = useState<"chart" | "equity">("chart");

    return (
        <div className={cn(
            "w-full rounded-2xl border bg-card/80 backdrop-blur-md shadow-2xl shadow-black/10 overflow-hidden",
            className
        )}>
            {/* Top bar */}
            <div className="flex items-center justify-between border-b px-5 py-3 bg-background/30">
                <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
                        <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
                        <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">BTCUSDT — 1H</span>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setActiveTab("chart")}
                        className={cn(
                            "px-3 py-1 text-xs rounded-md transition-colors",
                            activeTab === "chart"
                                ? "bg-primary/15 text-primary font-medium"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Chart
                    </button>
                    <button
                        onClick={() => setActiveTab("equity")}
                        className={cn(
                            "px-3 py-1 text-xs rounded-md transition-colors",
                            activeTab === "equity"
                                ? "bg-primary/15 text-primary font-medium"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Equity
                    </button>
                </div>
            </div>

            {/* Chart area */}
            <div className="p-4 bg-gradient-to-b from-background/50 to-transparent">
                <AnimatePresence mode="wait">
                    {activeTab === "chart" ? (
                        <motion.div
                            key="chart"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <CandlestickChart className="h-[240px] md:h-[280px]" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="equity"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <EquityCurve className="h-[240px] md:h-[280px]" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-px border-t bg-border">
                {STATS.map((s) => (
                    <div key={s.label} className="bg-card px-4 py-3 text-center">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
                        <p className={cn("text-sm font-bold font-mono mt-0.5", s.color)}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Live trades */}
            <div className="border-t">
                <div className="flex items-center gap-2 px-5 py-2 bg-background/30">
                    <motion.div
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                    />
                    <span className="text-[10px] uppercase tracking-wider font-medium text-emerald-500">Live Trades</span>
                </div>
                <div className="divide-y">
                    {LIVE_TRADES.map((trade, i) => (
                        <motion.div
                            key={trade.pair}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 2.5 + i * 0.12 }}
                            className="flex items-center justify-between px-5 py-2 hover:bg-muted/10 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-semibold">{trade.pair}</span>
                                <span className={cn(
                                    "text-[10px] font-medium px-1.5 py-0.5 rounded",
                                    trade.side === "LONG"
                                        ? "bg-emerald-500/10 text-emerald-500"
                                        : "bg-red-500/10 text-red-500"
                                )}>
                                    {trade.side}
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={cn(
                                    "text-xs font-mono font-medium",
                                    trade.pnl.startsWith("+") ? "text-emerald-500" : "text-red-500"
                                )}>
                                    {trade.pnl}
                                </span>
                                <span className="text-[10px] text-muted-foreground w-12 text-right">{trade.time}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
