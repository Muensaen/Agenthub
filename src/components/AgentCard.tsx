"use client";

import { Agent } from "@/types/agent";
import { AGENT_TYPE_LABELS } from "@/lib/agents";
import AgentStatusBadge from "@/components/AgentStatusBadge";

interface Props {
  agent: Agent;
  onRun: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function AgentCard({ agent, onRun, onDelete }: Props) {
  const isRunning = agent.status === "processing";
  const typeLabel = AGENT_TYPE_LABELS[agent.type] ?? agent.type;
  const createdDate = new Date(agent.createdAt).toLocaleString("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="group relative flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-semibold text-zinc-900 dark:text-zinc-50">
            {agent.name}
          </h2>
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            {typeLabel} · สร้างเมื่อ {createdDate}
          </p>
        </div>
        <AgentStatusBadge status={agent.status} progress={agent.progress} />
      </div>

      {/* Description */}
      {agent.description && (
        <p className="text-sm leading-relaxed text-zinc-600 line-clamp-2 dark:text-zinc-300">
          {agent.description}
        </p>
      )}

      {/* Progress bar */}
      {isRunning && agent.progress !== undefined && (
        <div className="overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
          <div
            className="h-1.5 rounded-full bg-blue-500 transition-all duration-500"
            style={{ width: `${agent.progress}%` }}
          />
        </div>
      )}

      {/* Result */}
      {agent.status === "completed" && agent.result && (
        <div className="rounded-xl bg-green-50 px-3 py-2 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-300">
          <span className="font-medium">ผลลัพธ์:</span> {agent.result}
        </div>
      )}

      {/* Error */}
      {agent.status === "failed" && agent.errorMessage && (
        <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-300">
          <span className="font-medium">ข้อผิดพลาด:</span> {agent.errorMessage}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={() => onRun(agent.id)}
          disabled={isRunning}
          className="flex-1 rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isRunning ? "กำลังประมวลผล..." : "เรียกใช้งาน"}
        </button>
        <button
          onClick={() => onDelete(agent.id)}
          disabled={isRunning}
          className="rounded-xl border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          ลบ
        </button>
      </div>
    </div>
  );
}
