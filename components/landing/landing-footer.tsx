"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="bg-obsidian border-t border-white/10 overflow-hidden">
      <div className="py-12">
        <div className="relative flex overflow-x-hidden">
          <motion.div
            className="flex whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          >
            {[...Array(4)].map((_, i) => (
              <span key={i} className="mx-8 text-8xl font-bold text-white/5 font-sans">
                STOP STARING AT CHARTS.
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-sm text-gray-500 font-mono">
            © 2024 PuckFinance. All rights reserved.
          </div>
          <div className="flex gap-8">
            <Link href="#" className="text-sm text-gray-400 hover:text-terminal-green transition-colors font-mono">
              Terms
            </Link>
            <Link href="#" className="text-sm text-gray-400 hover:text-terminal-green transition-colors font-mono">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-gray-400 hover:text-terminal-green transition-colors font-mono">
              Twitter
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
