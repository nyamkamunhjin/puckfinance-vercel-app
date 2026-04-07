"use client";

import { motion } from "framer-motion";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { ShaderBackground } from "./shader-background";

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-obsidian px-4 text-center">
      <ShaderBackground />
      
      <div className="relative z-10 flex flex-col items-center gap-8">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-4xl text-6xl font-bold leading-tight tracking-tighter text-white md:text-8xl lg:text-9xl font-sans"
        >
          Trading on <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-terminal-green to-cyber-violet">
            Autopilot.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="max-w-xl text-lg text-gray-400 font-mono"
        >
          Automate your crypto strategies. Monitor performance in real-time.
          Stop staring at charts.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6, type: "spring" }}
        >
          <MagneticButton className="mt-8">
            Launch App
          </MagneticButton>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-obsidian to-transparent" />
    </section>
  );
}
