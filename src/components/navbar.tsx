"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Terminal, Disc3 } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

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

          {/* Right Action / Hub Indicator */}
          <div className="flex items-center gap-3">
            {!isHome ? (
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-zinc-300 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all shadow-sm group"
              >
                <Disc3 className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-90 transition-transform duration-300" />
                <span>Central Hub</span>
              </Link>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-950/40 border border-violet-500/20 text-xs text-violet-300">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="hidden sm:inline">Interactive Navigation Plate</span>
                <span className="sm:hidden">Active Hub</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

