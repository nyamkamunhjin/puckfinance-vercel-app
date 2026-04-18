'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    ArrowUpRight,
    ArrowDownRight,
    TrendingUp,
    Activity,
    Wallet,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const portfolioStats = [
    {
        label: 'Net Worth',
        value: '$124,592.45',
        change: '+4.2%',
        trend: 'up' as const,
        icon: Wallet,
    },
    {
        label: 'Active Trades',
        value: '8',
        change: '3 Executing',
        trend: 'up' as const,
        icon: Activity,
    },
    {
        label: 'Total Profit',
        value: '$12,450.00',
        change: 'All Time',
        trend: 'up' as const,
        icon: TrendingUp,
    },
];

const trades = [
    {
        pair: 'BTC/USDT',
        side: 'Long' as const,
        entry: '$64,230',
        pnl: '+12.4%',
        status: 'Active',
    },
    {
        pair: 'ETH/USDT',
        side: 'Short' as const,
        entry: '$3,450',
        pnl: '+8.1%',
        status: 'Active',
    },
    {
        pair: 'SOL/USDT',
        side: 'Long' as const,
        entry: '$145',
        pnl: '-2.3%',
        status: 'Active',
    },
    {
        pair: 'AVAX/USDT',
        side: 'Long' as const,
        entry: '$38.20',
        pnl: '+5.7%',
        status: 'Closed',
    },
];

export function DashboardPreview() {
    return (
        <section
            className="relative py-24 md:py-32 overflow-hidden"
            aria-labelledby="dashboard-heading"
        >
            <h2 id="dashboard-heading" className="sr-only">
                Live Performance Monitor
            </h2>
            <div className="mx-auto max-w-7xl px-6">
                <div className="mb-16 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <span className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-1.5 text-sm text-muted-foreground mb-6">
                            <Activity className="size-3.5" />
                            Live Performance Monitor
                        </span>
                        <h2 className="text-4xl font-bold md:text-5xl">
                            Track Every Move{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-600">
                                in Real-Time
                            </span>
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                            Real-time tracking of your automated strategies. See
                            your portfolio performance at a glance.
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, type: 'spring', bounce: 0.2 }}
                    viewport={{ once: true }}
                >
                    <div className="mx-auto max-w-5xl rounded-2xl border bg-card/50 backdrop-blur-sm shadow-2xl shadow-black/5 overflow-hidden">
                        <div className="border-b p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold">
                                        Portfolio Overview
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-0.5">
                                        Your trading performance summary
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1.5">
                                    <div className="h-2 w-2 animate-pulse rounded-full bg-terminal-green" />
                                    <span className="text-xs font-medium text-terminal-green">
                                        Live
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="grid gap-4 sm:grid-cols-3">
                                {portfolioStats.map((stat, index) => (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.4,
                                            delay: index * 0.1,
                                        }}
                                        viewport={{ once: true }}
                                        className="group rounded-xl border bg-background/50 p-5 hover:border-primary/20 hover:shadow-md transition-all duration-300"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm text-muted-foreground">
                                                {stat.label}
                                            </span>
                                            <div className="rounded-lg bg-primary/10 p-2 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                                <stat.icon className="size-4" />
                                            </div>
                                        </div>
                                        <div className="text-2xl font-bold tracking-tight">
                                            {stat.value}
                                        </div>
                                        <div
                                            className={cn(
                                                'mt-1 text-xs font-medium flex items-center gap-1',
                                                stat.trend === 'up'
                                                    ? 'text-terminal-green'
                                                    : 'text-red-500',
                                            )}
                                        >
                                            {stat.trend === 'up' ? (
                                                <ArrowUpRight className="size-3" />
                                            ) : (
                                                <ArrowDownRight className="size-3" />
                                            )}
                                            {stat.change}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="mt-8">
                                <h4 className="mb-4 text-sm font-semibold text-muted-foreground">
                                    Recent Activity
                                </h4>
                                <div className="rounded-xl border overflow-hidden">
                                    <div className="grid grid-cols-5 gap-4 border-b bg-muted/30 px-4 py-3">
                                        <span className="text-xs font-medium text-muted-foreground">
                                            Pair
                                        </span>
                                        <span className="text-xs font-medium text-muted-foreground">
                                            Side
                                        </span>
                                        <span className="text-xs font-medium text-muted-foreground">
                                            Entry
                                        </span>
                                        <span className="text-xs font-medium text-muted-foreground">
                                            PnL
                                        </span>
                                        <span className="text-xs font-medium text-muted-foreground text-right">
                                            Status
                                        </span>
                                    </div>
                                    {trades.map((trade, index) => (
                                        <motion.div
                                            key={trade.pair}
                                            initial={{ opacity: 0 }}
                                            whileInView={{ opacity: 1 }}
                                            transition={{
                                                duration: 0.3,
                                                delay: 0.4 + index * 0.08,
                                            }}
                                            viewport={{ once: true }}
                                            className="grid grid-cols-5 gap-4 border-b last:border-b-0 px-4 py-3.5 hover:bg-muted/20 transition-colors"
                                        >
                                            <span className="text-sm font-semibold">
                                                {trade.pair}
                                            </span>
                                            <span>
                                                <span
                                                    className={cn(
                                                        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
                                                        trade.side === 'Long'
                                                            ? 'bg-terminal-green/10 text-terminal-green'
                                                            : 'bg-red-500/10 text-red-500',
                                                    )}
                                                >
                                                    {trade.side}
                                                </span>
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                {trade.entry}
                                            </span>
                                            <span
                                                className={cn(
                                                    'text-sm font-medium',
                                                    trade.pnl.startsWith('+')
                                                        ? 'text-terminal-green'
                                                        : 'text-red-500',
                                                )}
                                            >
                                                {trade.pnl}
                                            </span>
                                            <div className="flex items-center justify-end gap-2">
                                                <div
                                                    className={cn(
                                                        'h-1.5 w-1.5 rounded-full',
                                                        trade.status ===
                                                            'Active'
                                                            ? 'bg-terminal-green animate-pulse'
                                                            : 'bg-muted-foreground',
                                                    )}
                                                />
                                                <span className="text-sm text-muted-foreground">
                                                    {trade.status}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
