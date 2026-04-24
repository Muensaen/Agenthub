"use client";

import { AgentStatus } from "@/types/agent";
import { STATUS_LABELS } from "@/lib/agents";

interface Props {
  status: AgentStatus;
  progress?: number;
}

const statusConfig: Record<
  AgentStatus,
  { bg: string; text: string; dot: string }
> = {
  pending: {
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
    text: "text-yellow-800 dark:text-yellow-300",
    dot: "bg-yellow-500",
  },
  processing: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-800 dark:text-blue-300",
    dot: "bg-blue-500",
  },
  completed: {
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-800 dark:text-green-300",
    dot: "bg-green-500",
  },
  failed: {
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-800 dark:text-red-300",
    dot: "bg-red-500",
  },
};

export default function AgentStatusBadge({ status, progress }: Props) {
  const cfg = statusConfig[status];
  const label = STATUS_LABELS[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.bg} ${cfg.text}`}
    >
      {status === "processing" ? (
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full ${cfg.dot} opacity-75`}
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${cfg.dot}`}
          />
        </span>
      ) : (
        <span className={`inline-block h-2 w-2 rounded-full ${cfg.dot}`} />
      )}
      {label}
      {status === "processing" && progress !== undefined && (
        <span className="ml-1 font-semibold">{progress}%</span>
      )}
    </span>
  );
}
