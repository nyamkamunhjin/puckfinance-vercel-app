'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Activity, Globe, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
    {
        title: 'Automated Trading',
        description:
            'Set your rules and let the bot execute trades 24/7. No emotions, no hesitation — just consistent execution.',
        icon: Bot,
        accent: 'indigo',
        details: [
            'Custom strategy rules',
            '24/7 non-stop execution',
            'Zero emotional interference',
        ],
    },
    {
        title: 'Real-time Monitor',
        description:
            'Track every movement in the market as it happens. Live PnL, open positions, and instant alerts.',
        icon: Activity,
        accent: 'emerald',
        details: [
            'Live portfolio tracking',
            'Instant trade alerts',
            'Performance analytics',
        ],
    },
    {
        title: 'Multi-Exchange',
        description:
            'One dashboard, every exchange. Trade across Binance, Coinbase, Kraken and more from a single view.',
        icon: Globe,
        accent: 'violet',
        details: [
            'Unified portfolio view',
            'Cross-exchange trading',
            'Single API management',
        ],
    },
];

const accentStyles: Record<string, { border: string; dot: string; icon: string; glow: string }> = {
    indigo: {
        border: 'group-hover:border-indigo-500/30',
        dot: 'bg-indigo-500',
        icon: 'bg-indigo-500/10 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white',
        glow: 'group-hover:shadow-indigo-500/10',
    },
    emerald: {
        border: 'group-hover:border-emerald-500/30',
        dot: 'bg-emerald-500',
        icon: 'bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white',
        glow: 'group-hover:shadow-emerald-500/10',
    },
    violet: {
        border: 'group-hover:border-violet-500/30',
        dot: 'bg-violet-500',
        icon: 'bg-violet-500/10 text-violet-500 group-hover:bg-violet-500 group-hover:text-white',
        glow: 'group-hover:shadow-violet-500/10',
    },
};

export function FeaturesGrid() {
    return (
        <section
            className="relative py-24 md:py-32"
            id="features"
            aria-labelledby="features-heading"
        >
            <div className="mx-auto max-w-7xl px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="mb-20 text-center"
                >
                    <span className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-1.5 text-sm text-muted-foreground mb-6">
                        <Sparkles className="size-3.5" />
                        Features
                    </span>
                    <h2
                        id="features-heading"
                        className="text-4xl font-bold md:text-5xl"
                    >
                        Power Under{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-600">
                            the Hood
                        </span>
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
                        Everything you need to automate your crypto empire.
                    </p>
                </motion.div>

                <div className="grid gap-8 md:grid-cols-3">
                    {features.map((feature, index) => {
                        const styles = accentStyles[feature.accent];

                        return (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.15 }}
                                viewport={{ once: true }}
                                className="group"
                            >
                                <div
                                    className={cn(
                                        'relative h-full rounded-2xl border bg-card p-8 transition-all duration-500 hover:shadow-2xl',
                                        styles.border,
                                        styles.glow,
                                    )}
                                >
                                    <div
                                        className={cn(
                                            'mb-6 inline-flex h-11 w-11 items-center justify-center rounded-lg transition-all duration-300',
                                            styles.icon,
                                        )}
                                    >
                                        <feature.icon className="h-5 w-5" />
                                    </div>

                                    <h3 className="text-xl font-semibold mb-3">
                                        {feature.title}
                                    </h3>

                                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                                        {feature.description}
                                    </p>

                                    <ul className="space-y-2.5">
                                        {feature.details.map((detail) => (
                                            <li
                                                key={detail}
                                                className="flex items-center gap-2.5 text-sm text-muted-foreground"
                                            >
                                                <span
                                                    className={cn(
                                                        'h-1 w-1 shrink-0 rounded-full',
                                                        styles.dot,
                                                    )}
                                                />
                                                {detail}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
