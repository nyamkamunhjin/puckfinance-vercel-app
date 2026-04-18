'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Bot,
    Activity,
    Zap,
    Shield,
    BarChart3,
    Globe,
    ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
    {
        title: 'Automated Trading',
        description:
            'Set your rules and let the bot execute trades 24/7 with precision timing. No emotions, no hesitation.',
        icon: Bot,
        gradient: 'from-indigo-500 to-blue-500',
    },
    {
        title: 'Real-time Monitor',
        description:
            'Track every movement in the market with our advanced dashboard and live updates.',
        icon: Activity,
        gradient: 'from-terminal-green to-emerald-500',
    },
    {
        title: 'Lightning Fast',
        description:
            'Execution speeds that beat the market average by 50ms. Every millisecond counts.',
        icon: Zap,
        gradient: 'from-amber-500 to-orange-500',
    },
    {
        title: 'Bank-Grade Security',
        description:
            'Your assets are protected by industry-leading encryption standards. We never store your funds.',
        icon: Shield,
        gradient: 'from-cyber-violet to-purple-500',
    },
    {
        title: 'Advanced Analytics',
        description:
            'Deep insights into your trading performance with detailed charts and AI-powered analysis.',
        icon: BarChart3,
        gradient: 'from-pink-500 to-rose-500',
    },
    {
        title: 'Multi-Exchange',
        description:
            'Connect to all major exchanges from a single dashboard. Unified portfolio view.',
        icon: Globe,
        gradient: 'from-cyan-500 to-teal-500',
    },
];

export function FeaturesGrid() {
    return (
        <section
            className="relative py-24 md:py-32"
            id="features"
            aria-labelledby="features-heading"
        >
            <div className="absolute inset-0 -z-10" aria-hidden="true">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--muted)_0%,transparent_70%)]" />
            </div>
            <div className="mx-auto max-w-7xl px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="mb-16 text-center"
                >
                    <span className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-1.5 text-sm text-muted-foreground mb-6">
                        <Zap className="size-3.5" />
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
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        Everything you need to automate your crypto empire.
                        Built for traders who value precision.
                    </p>
                </motion.div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group"
                        >
                            <div className="relative h-full rounded-2xl border bg-card/50 backdrop-blur-sm p-6 hover:shadow-xl hover:shadow-black/5 hover:border-primary/20 transition-all duration-500">
                                <div
                                    className={cn(
                                        'mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg transition-transform duration-500 group-hover:scale-110',
                                        feature.gradient,
                                    )}
                                >
                                    <feature.icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-lg font-bold mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>
                                <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                    Learn more
                                    <ArrowRight className="ml-1 size-3.5" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
