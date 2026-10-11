"use client";

import React from "react";
import { motion } from "framer-motion";
import { CircularRevealHeading, TextItem } from "@/components/ui/circular-reveal-heading";
import { TypewriterText } from "@/components/ui/typewriter-text";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Sparkles } from "lucide-react";

const NAV_ITEMS: TextItem[] = [
  {
    text: "EMB",
    href: "/",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80",
  },
  {
    text: "TEAM",
    href: "/team",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
  },
  {
    text: "REGISTER",
    href: "/register",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80",
  },
  {
    text: "ADMIN",
    href: "/admin",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80",
  },
];

export default function HomePage() {
  const isSm = useMediaQuery("(max-width: 639px)");
  const isMd = useMediaQuery("(min-width: 640px) and (max-width: 1023px)");

  const plateSize: "sm" | "md" | "lg" = isSm ? "sm" : isMd ? "md" : "lg";

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center px-4 py-8 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-violet-600/10 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-950/60 border border-violet-500/30 text-violet-300 text-xs font-medium mb-6 shadow-lg shadow-violet-950/30"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>The Next Generation Engineering Community · PES</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4"
        >
          Build. Innovate.{" "}
          <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">
            Belong.
          </span>
        </motion.h1>

        {/* Highlighted Typewriter Prompt */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl text-zinc-400 text-sm sm:text-base mb-8 leading-relaxed flex flex-col items-center gap-2.5"
        >
          <p>Welcome to the official Embrione member platform.</p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-950/50 border border-violet-500/30 shadow-[0_0_20px_rgba(139,92,246,0.18)] text-violet-200 text-xs sm:text-sm font-medium tracking-wide backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
            <TypewriterText
              text="Click on central disc roles"
              speed={40}
              delay={350}
              loop={true}
              pauseFor={3500}
              cursorClassName="text-cyan-400 font-bold"
            />
          </div>
        </motion.div>

        {/* Center Circular Reveal Navigation Plate */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="my-4"
        >
          <CircularRevealHeading
            items={NAV_ITEMS}
            centerText="EMBRIONE"
            centerSubtitle="PES UNIVERSITY"
            size={plateSize}
          />
        </motion.div>

        <p className="text-xs text-zinc-400 mt-4 tracking-wide">
          Hover over or tap any section rim to reveal preview · Click to navigate
        </p>
      </div>
    </div>
  );
}


