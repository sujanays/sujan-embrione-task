import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  variant: "pending" | "approved" | "rejected" | "total";
  description?: string;
  onClick?: () => void;
  active?: boolean;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  variant,
  description,
  onClick,
  active = false,
}: StatCardProps) {
  const styles = {
    pending: {
      border: "hover:border-amber-500/40",
      activeBorder: "border-amber-500/70 shadow-amber-500/10",
      bgGlow: "group-hover:bg-amber-500/10",
      textColor: "text-amber-400",
      iconBg: "bg-amber-950/40 text-amber-400 border-amber-500/20",
    },
    approved: {
      border: "hover:border-emerald-500/40",
      activeBorder: "border-emerald-500/70 shadow-emerald-500/10",
      bgGlow: "group-hover:bg-emerald-500/10",
      textColor: "text-emerald-400",
      iconBg: "bg-emerald-950/40 text-emerald-400 border-emerald-500/20",
    },
    rejected: {
      border: "hover:border-rose-500/40",
      activeBorder: "border-rose-500/70 shadow-rose-500/10",
      bgGlow: "group-hover:bg-rose-500/10",
      textColor: "text-rose-400",
      iconBg: "bg-rose-950/40 text-rose-400 border-rose-500/20",
    },
    total: {
      border: "hover:border-violet-500/40",
      activeBorder: "border-violet-500/70 shadow-violet-500/10",
      bgGlow: "group-hover:bg-violet-500/10",
      textColor: "text-violet-400",
      iconBg: "bg-violet-950/40 text-violet-400 border-violet-500/20",
    },
  }[variant];

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative w-full text-left p-5 rounded-2xl transition-all duration-300",
        "bg-[#141419] border border-white/8 shadow-lg",
        onClick && "cursor-pointer hover:-translate-y-0.5",
        styles.border,
        active && cn(styles.activeBorder, "bg-[#181820] shadow-md")
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase font-medium tracking-wider text-zinc-400">
          {title}
        </span>
        <div className={cn("p-2 rounded-xl border", styles.iconBg)}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className={cn("text-3xl font-bold tracking-tight", styles.textColor)}>
          {value}
        </span>
        {description && (
          <span className="text-xs text-zinc-500 font-medium">
            {description}
          </span>
        )}
      </div>
    </button>
  );
}
