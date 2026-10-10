import React from "react";
import { MemberStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

interface StatusBadgeProps {
  status: MemberStatus;
  className?: string;
  showIcon?: boolean;
}

export function StatusBadge({ status, className, showIcon = true }: StatusBadgeProps) {
  const config = {
    approved: {
      label: "Approved",
      color: "bg-emerald-950/60 text-emerald-400 border-emerald-500/30",
      icon: CheckCircle2,
      dot: "bg-emerald-400",
    },
    pending: {
      label: "Pending",
      color: "bg-amber-950/60 text-amber-400 border-amber-500/30",
      icon: Clock,
      dot: "bg-amber-400",
    },
    rejected: {
      label: "Rejected",
      color: "bg-rose-950/60 text-rose-400 border-rose-500/30",
      icon: XCircle,
      dot: "bg-rose-400",
    },
  }[status];

  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-xs transition-colors",
        config.color,
        className
      )}
    >
      {showIcon ? (
        <Icon className="w-3.5 h-3.5" />
      ) : (
        <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", config.dot)} />
      )}
      <span>{config.label}</span>
    </span>
  );
}
