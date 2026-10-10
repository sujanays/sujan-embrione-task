"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Users, UserPlus, Shield, Menu, X, Terminal } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/team", label: "Team", icon: Users },
    { href: "/register", label: "Register", icon: UserPlus },
    { href: "/admin", label: "Admin", icon: Shield },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/8 bg-[#0a0a0b]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none"
            aria-label="Embrione Home"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 p-0.5 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0d0d12] rounded-[10px] flex items-center justify-center">
                <Terminal className="w-4 h-4 text-cyan-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors text-base flex items-center gap-1.5">
                EMBRIONE
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.2 rounded-md bg-violet-950 text-violet-300 border border-violet-500/30">
                  PES
                </span>
              </span>
              <span className="text-[10px] text-zinc-400 -mt-0.5 font-medium tracking-wider">
                MEMBER HUB
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "text-white bg-white/5 border border-white/10 shadow-inner"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]"
                  )}
                >
                  <Icon className={cn("w-4 h-4", isActive ? "text-cyan-400" : "text-zinc-400")} />
                  <span>{link.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-glow-indicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-violet-400 to-cyan-400 rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 border border-white/5 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-white/10 bg-[#0e0e12]/95 backdrop-blur-2xl overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                      isActive
                        ? "text-white bg-violet-600/10 border border-violet-500/20 text-cyan-300"
                        : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5"
                    )}
                  >
                    <Icon className="w-5 h-5 text-violet-400" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
