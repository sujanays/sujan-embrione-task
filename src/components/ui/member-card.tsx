"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Member } from "@/lib/types";
import { cn } from "@/lib/utils";
import { GraduationCap, IdCard, Sparkles } from "lucide-react";
import { LinkedInIcon, GitHubIcon } from "./icons";
import { StatusBadge } from "./status-badge";

export interface MemberCardProps {
  member: Partial<Member>;
  isPreview?: boolean;
  className?: string;
  showStatus?: boolean;
}

const POSITION_COLORS: Record<string, string> = {
  Head: "bg-violet-950/70 text-violet-300 border-violet-500/30",
  "Vice-Head": "bg-indigo-950/70 text-indigo-300 border-indigo-500/30",
  "Core Member": "bg-cyan-950/70 text-cyan-300 border-cyan-500/30",
  Member: "bg-zinc-800/80 text-zinc-300 border-zinc-700/50",
};

export function MemberCard({
  member,
  isPreview = false,
  className,
  showStatus = false,
}: MemberCardProps) {
  const {
    full_name = "",
    domain = "",
    position = "",
    srn = "",
    branch = "",
    semester,
    bio = "",
    avatar_url = "",
    linkedin_url = "",
    github_url = "",
    status = "pending",
  } = member;

  const displayName = full_name.trim() || (isPreview ? "Your Full Name" : "Anonymous Member");
  const displayDomain = domain || (isPreview ? "Select Domain" : "General");
  const displayPosition = position || (isPreview ? "Position" : "Member");
  const displayBranch = branch || (isPreview ? "Branch" : "ENGG");
  const displaySem = semester ? `Sem ${semester}` : (isPreview ? "Sem X" : "");
  const displaySrn = srn.trim() || (isPreview ? "PES1UG23CS000" : "");
  const displayBio =
    bio.trim() ||
    (isPreview
      ? "Your 150–200 character bio will be rendered here dynamically as you write..."
      : "No bio provided.");

  // Initials for fallback avatar
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("") || "E";

  const positionColor = POSITION_COLORS[position] || POSITION_COLORS["Member"];

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl",
        "bg-[#131317] border border-white/8 transition-all duration-300",
        "hover:border-violet-500/30 hover:shadow-xl hover:shadow-violet-950/20",
        isPreview && "border-violet-500/20 shadow-md shadow-violet-950/10",
        className
      )}
    >
      {/* Top subtle decorative ambient glow */}
      <div className="absolute top-0 right-0 -mr-12 -mt-12 w-32 h-32 rounded-full bg-violet-600/10 blur-2xl group-hover:bg-cyan-500/15 transition-all duration-500 pointer-events-none" />

      {/* Main card body */}
      <div className="p-6 relative z-10 flex flex-col gap-4">
        {/* Header row: Avatar + Name & Roles */}
        <div className="flex items-start gap-4">
          {/* Avatar frame */}
          <div className="relative shrink-0 w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-cyan-400/40 bg-zinc-900 shadow-md transition-colors">
            {avatar_url ? (
              <Image
                src={avatar_url}
                alt={displayName}
                fill
                sizes="64px"
                className="object-cover"
                unoptimized={avatar_url.startsWith("data:") || avatar_url.startsWith("blob:")}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-900/60 via-zinc-900 to-cyan-950/50 text-white font-bold text-lg select-none">
                {initials}
              </div>
            )}
          </div>

          {/* Identity details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3
                className={cn(
                  "font-semibold text-lg leading-tight tracking-tight truncate text-zinc-100",
                  !full_name && isPreview && "text-zinc-500 italic"
                )}
              >
                {displayName}
              </h3>
              {showStatus && <StatusBadge status={status} />}
            </div>

            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              <span
                className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border tracking-wide",
                  positionColor
                )}
              >
                {displayPosition}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-zinc-900/90 text-cyan-300 border border-cyan-500/20">
                {displayDomain}
              </span>
            </div>
          </div>
        </div>

        {/* Academic / SRN metadata chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 pt-1 border-t border-white/5">
          <div className="inline-flex items-center gap-1 bg-zinc-900/60 px-2 py-1 rounded-md border border-white/5">
            <GraduationCap className="w-3.5 h-3.5 text-violet-400" />
            <span className="truncate">
              {displayBranch} {displaySem ? `· ${displaySem}` : ""}
            </span>
          </div>

          <div className="inline-flex items-center gap-1 bg-zinc-900/60 px-2 py-1 rounded-md border border-white/5 font-mono text-[11px]">
            <IdCard className="w-3.5 h-3.5 text-cyan-400" />
            <span className="truncate">{displaySrn}</span>
          </div>
        </div>

        {/* Member Bio */}
        <div className="relative">
          <p
            className={cn(
              "text-xs leading-relaxed text-zinc-300 line-clamp-4",
              !bio && isPreview && "text-zinc-500 italic"
            )}
          >
            {displayBio}
          </p>
        </div>
      </div>

      {/* Footer row: Social links + Branding tag */}
      <div className="px-6 py-3.5 bg-[#0e0e12] border-t border-white/5 flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2">
          {linkedin_url ? (
            <a
              href={linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <LinkedInIcon className="w-4 h-4 text-sky-400" />
            </a>
          ) : (
            <span className="p-1.5 text-zinc-600 cursor-not-allowed" title="No LinkedIn provided">
              <LinkedInIcon className="w-4 h-4" />
            </span>
          )}

          {github_url ? (
            <a
              href={github_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <GitHubIcon className="w-4 h-4 text-zinc-200" />
            </a>
          ) : (
            <span className="p-1.5 text-zinc-600 cursor-not-allowed" title="No GitHub provided">
              <GitHubIcon className="w-4 h-4" />
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-[11px] font-medium text-zinc-500">
          <Sparkles className="w-3 h-3 text-violet-400" />
          <span>Embrione PES</span>
        </div>
      </div>
    </motion.div>
  );
}
