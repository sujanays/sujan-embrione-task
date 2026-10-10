"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CircularRevealHeading, TextItem } from "@/components/ui/circular-reveal-heading";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Users, UserPlus, Shield, ArrowRight, Sparkles, Terminal } from "lucide-react";

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

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-xl text-zinc-400 text-sm sm:text-base mb-8 leading-relaxed"
        >
          Welcome to the official Embrione member platform. Interact with the central navigation
          plate to explore approved talent, register your profile, or moderate the roster.
        </motion.p>

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

        <p className="hidden md:block text-xs text-zinc-400 mt-4 tracking-wide">
          Hover over any section rim to reveal preview · Click to navigate
        </p>

        {/* Mobile Fallback Link List (Section 2.2 #3: md:hidden fallback list) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-md md:hidden"
        >
          <Link
            href="/team"
            className="flex items-center justify-between p-3.5 rounded-xl bg-[#141419] border border-white/10 hover:border-violet-500/40 text-sm font-medium text-zinc-200 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Meet The Team</span>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-500" />
          </Link>

          <Link
            href="/register"
            className="flex items-center justify-between p-3.5 rounded-xl bg-[#141419] border border-white/10 hover:border-violet-500/40 text-sm font-medium text-zinc-200 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <UserPlus className="w-4 h-4 text-violet-400" />
              <span>Join Embrione</span>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-500" />
          </Link>

          <Link
            href="/admin"
            className="flex items-center justify-between p-3.5 rounded-xl bg-[#141419] border border-white/10 hover:border-violet-500/40 text-sm font-medium text-zinc-200 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Admin Portal</span>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-500" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
