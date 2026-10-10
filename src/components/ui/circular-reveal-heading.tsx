"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TextItem {
  text: string;
  image: string;
  href: string;
}

export interface CircularRevealHeadingProps {
  items: TextItem[];
  centerText?: string;
  centerSubtitle?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CONFIG = {
  sm: { diameter: 320, radius: 115, fontSize: "11px", innerImageSize: 140 },
  md: { diameter: 420, radius: 155, fontSize: "12px", innerImageSize: 190 },
  lg: { diameter: 520, radius: 195, fontSize: "13px", innerImageSize: 240 },
};

export function CircularRevealHeading({
  items,
  centerText = "EMBRIONE",
  centerSubtitle = "PES UNIVERSITY",
  size = "lg",
  className,
}: CircularRevealHeadingProps) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [touchedIndex, setTouchedIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { diameter, radius, fontSize, innerImageSize } =
    SIZE_CONFIG[size] || SIZE_CONFIG.lg;

  const totalItems = items.length;

  // Preload images
  const imageSources = useMemo(() => items.map((i) => i.image), [items]);

  useEffect(() => {
    imageSources.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, [imageSources]);

  const handleItemTouch = (
    item: TextItem,
    index: number,
    e: React.TouchEvent
  ) => {
    if (touchedIndex === index) {
      router.push(item.href);
    } else {
      e.preventDefault();
      setTouchedIndex(index);
      setActiveIndex(index);
    }
  };

  const activeItem = activeIndex !== null ? items[activeIndex] : null;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex items-center justify-center select-none touch-manipulation",
        className
      )}
      style={{ width: diameter, height: diameter }}
    >
      {/* Outer ambient glow */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none opacity-40 blur-2xl transition-all duration-700"
        style={{
          background: activeItem
            ? "radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, rgba(34, 211, 238, 0.15) 70%, transparent 100%)"
            : "radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, rgba(23, 23, 28, 0.4) 70%, transparent 100%)",
        }}
      />

      {/* Neumorphic Dark Plate Surface */}
      <div
        className="absolute inset-2 rounded-full border border-white/10 transition-transform duration-500 shadow-2xl"
        style={{
          background:
            "radial-gradient(135% 135% at 30% 25%, #1c1c24 0%, #111116 55%, #09090c 100%)",
          boxShadow:
            "inset 0 1px 1px rgba(255, 255, 255, 0.15), inset 0 -2px 6px rgba(0, 0, 0, 0.8), 0 20px 40px -15px rgba(0,0,0,0.8)",
        }}
      />

      {/* Rotating Ring with Text Links */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center cursor-pointer pointer-events-auto"
        animate={shouldReduceMotion ? { rotate: 0 } : { rotate: 360 }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 36,
        }}
      >
        <svg
          viewBox={`0 0 ${diameter} ${diameter}`}
          width={diameter}
          height={diameter}
          className="w-full h-full overflow-visible"
        >
          <defs>
            {/* Smooth closed circular track */}
            <path
              id={`circle-track-${diameter}`}
              d={`
                M ${diameter / 2}, ${diameter / 2 - radius}
                a ${radius},${radius} 0 1,1 0,${radius * 2}
                a ${radius},${radius} 0 1,1 0,-${radius * 2}
              `}
            />
          </defs>

          {items.map((item, idx) => {
            
            const offsetPercentage = `${((idx + 0.5) / totalItems) * 100}%`;
            const isHovered = activeIndex === idx;

            return (
              <text
                key={`${item.text}-${idx}`}
                role="link"
                tabIndex={0}
                aria-label={`Navigate to ${item.text}`}
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseLeave={() => setActiveIndex(null)}
                onTouchStart={(e) => handleItemTouch(item, idx, e)}
                onClick={() => router.push(item.href)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    router.push(item.href);
                  }
                }}
                className="cursor-pointer transition-all duration-300 outline-none"
                style={{
                  fontSize,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontWeight: isHovered ? 700 : 500,
                  fill: isHovered ? "#38bdf8" : "#d4d4d8",
                  filter: isHovered
                    ? "drop-shadow(0 0 8px rgba(56, 189, 248, 0.8))"
                    : "none",
                }}
              >
                <textPath
                  href={`#circle-track-${diameter}`}
                  startOffset={offsetPercentage}
                  textAnchor="middle"
                >
                  {item.text} •
                </textPath>
              </text>
            );
          })}
        </svg>
      </motion.div>

      {/* Center Core Area */}
      <div
        className="relative z-10 flex items-center justify-center overflow-hidden rounded-full border border-white/10 shadow-inner bg-[#0d0d10]"
        style={{
          width: innerImageSize,
          height: innerImageSize,
          boxShadow:
            "inset 0 4px 12px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)",
        }}
      >
        <AnimatePresence mode="wait">
          {activeItem ? (
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <Image
                src={activeItem.image}
                alt={activeItem.text}
                fill
                sizes="(max-width: 768px) 180px, 240px"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col items-center justify-end pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-white drop-shadow-md text-center px-2">
                  {activeItem.text}
                </span>
                <span className="text-[10px] text-cyan-300 font-medium tracking-tight">
                  Click to explore →
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="center-default"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center justify-center text-center p-2 w-full"
            >
              <div className="h-2 w-2 rounded-full bg-cyan-400 mb-2 animate-pulse shadow-sm shadow-cyan-400" />
              <span className="font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-white to-cyan-300 text-xs sm:text-sm md:text-base leading-tight block w-full truncate">
                {centerText}
              </span>
              <span className="text-[9px] md:text-[10px] uppercase tracking-wider text-zinc-400 font-medium mt-1 block">
                {centerSubtitle}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}