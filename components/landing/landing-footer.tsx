'use client';

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export function LandingFooter() {
  return (
    <footer className="border-t" role="contentinfo">
      <div className="py-12 overflow-hidden">
        <div className="relative flex overflow-x-hidden">
          <motion.div
            className="flex whitespace-nowrap"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}>
            {[...Array(4)].map((_, i) => (
              <span key={i} className="mx-8 text-7xl md:text-8xl font-bold text-foreground/[0.03]">
                STOP STARING AT CHARTS.
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="font-bold text-xl bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              PuckFinance
            </span>
            <span className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} PuckFinance. All rights reserved.
            </span>
          </div>
          <nav className="flex gap-8" aria-label="Footer navigation">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Twitter
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
