"use client";

import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TypewriterTextProps {
  /** The text or array of texts to type out */
  text: string | string[];
  /** Typing speed per character in milliseconds (default: 45) */
  speed?: number;
  /** Delay before typing starts in milliseconds (default: 300) */
  delay?: number;
  /** Delay before deleting when looping in milliseconds (default: 2500) */
  pauseFor?: number;
  /** Delete speed per character in milliseconds (default: 25) */
  deleteSpeed?: number;
  /** Whether to loop the typing effect (default: false) */
  loop?: boolean;
  /** Custom cursor element or character (default: "▎") */
  cursor?: React.ReactNode;
  /** Class name for the cursor element */
  cursorClassName?: string;
  /** Class name for the wrapper */
  className?: string;
  /** Whether cursor should continue blinking after text is fully typed (default: true) */
  keepCursor?: boolean;
}

export function TypewriterText({
  text,
  speed = 45,
  delay = 300,
  pauseFor = 2500,
  deleteSpeed = 25,
  loop = false,
  cursor = "▎",
  cursorClassName,
  className,
  keepCursor = true,
}: TypewriterTextProps) {
  const shouldReduceMotion = useReducedMotion();
  const texts = React.useMemo(() => (Array.isArray(text) ? text : [text]), [text]);

  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Initial delay timer
  useEffect(() => {
    if (shouldReduceMotion) return;
    const timeout = setTimeout(() => {
      setIsStarted(true);
    }, delay);
    return () => clearTimeout(timeout);
  }, [delay, shouldReduceMotion]);

  useEffect(() => {
    if (shouldReduceMotion || !isStarted || isFinished) return;

    const currentTarget = texts[currentTextIndex] || "";

    if (!isDeleting) {
      // Typing phase
      if (displayedText.length < currentTarget.length) {
        const timeout = setTimeout(() => {
          setDisplayedText(currentTarget.slice(0, displayedText.length + 1));
        }, speed);
        return () => clearTimeout(timeout);
      } else {
        // Completed typing current string
        if (!loop && currentTextIndex === texts.length - 1) {
          const timeout = setTimeout(() => {
            setIsFinished(true);
          }, 0);
          return () => clearTimeout(timeout);
        }

        // Pause before deleting if looping
        const timeout = setTimeout(() => {
          setIsDeleting(true);
        }, pauseFor);
        return () => clearTimeout(timeout);
      }
    } else {
      // Deleting phase
      if (displayedText.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayedText(currentTarget.slice(0, displayedText.length - 1));
        }, deleteSpeed);
        return () => clearTimeout(timeout);
      } else {
        // Finished deleting, move to next string
        const timeout = setTimeout(() => {
          setIsDeleting(false);
          setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        }, 0);
        return () => clearTimeout(timeout);
      }
    }
  }, [
    isStarted,
    displayedText,
    isDeleting,
    currentTextIndex,
    isFinished,
    texts,
    speed,
    deleteSpeed,
    pauseFor,
    loop,
    shouldReduceMotion,
  ]);

  const outputText = shouldReduceMotion ? (texts[0] || "") : displayedText;

  return (
    <span className={cn("inline-flex items-center flex-wrap align-middle", className)}>
      <span>{outputText}</span>
      {(keepCursor || !isFinished) && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            duration: 0.9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={cn(
            "inline-block ml-0.5 text-cyan-400 font-normal select-none pointer-events-none drop-shadow-[0_0_8px_rgba(34,211,238,0.7)]",
            cursorClassName
          )}
          aria-hidden="true"
        >
          {cursor}
        </motion.span>
      )}
    </span>
  );
}
