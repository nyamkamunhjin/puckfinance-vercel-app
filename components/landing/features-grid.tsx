"use client";

import { motion } from "framer-motion";
import { Bot, Activity, Zap, Shield, BarChart3, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Automated Trading",
    description: "Set your rules and let the bot execute trades 24/7 with precision timing.",
    icon: Bot,
    className: "md:col-span-2",
  },
  {
    title: "Real-time Monitor",
    description: "Track every movement in the market with our advanced dashboard.",
    icon: Activity,
    className: "md:col-span-1",
  },
  {
    title: "Lightning Fast",
    description: "Execution speeds that beat the market average by 50ms.",
    icon: Zap,
    className: "md:col-span-1",
  },
  {
    title: "Bank-Grade Security",
    description: "Your assets are protected by industry-leading encryption standards.",
    icon: Shield,
    className: "md:col-span-2",
  },
];

export function FeaturesGrid() {
  return (
    <section className="relative bg-obsidian py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-white md:text-5xl font-sans">
            Power Under the Hood
          </h2>
          <p className="mt-4 text-gray-400 font-mono">
            Everything you need to automate your crypto empire.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={feature.className}
            >
              <Card className="h-full border-white/10 bg-white/5 backdrop-blur-sm transition-colors hover:bg-white/10 hover:border-terminal-green/50 group">
                <CardHeader>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-terminal-green/10 text-terminal-green group-hover:bg-terminal-green group-hover:text-obsidian transition-colors">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl font-bold text-white font-sans">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 font-mono">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
