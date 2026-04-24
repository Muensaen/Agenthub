"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AgentType, CreateAgentInput } from "@/types/agent";
import { AGENT_TYPE_LABELS } from "@/lib/agents";

interface Props {
  onSubmit: (input: CreateAgentInput) => void;
}

const AGENT_TYPES = Object.keys(AGENT_TYPE_LABELS) as AgentType[];

export default function CreateAgentForm({ onSubmit }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<AgentType>("text-generation");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("กรุณาระบุชื่อ Agent");
      return;
    }
    setError("");
    setCreating(true);

    // Simulate a brief "creating" delay to show processing state
    await new Promise((r) => setTimeout(r, 800));

    onSubmit({ name: name.trim(), description: description.trim(), type });
    setCreating(false);
    router.push("/");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          ชื่อ Agent <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="เช่น Customer Support Bot"
          maxLength={80}
          disabled={creating}
          className="rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-blue-900"
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>

      {/* Type */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          ประเภท Agent
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as AgentType)}
          disabled={creating}
          className="rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-blue-900"
        >
          {AGENT_TYPES.map((t) => (
            <option key={t} value={t}>
              {AGENT_TYPE_LABELS[t]}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          คำอธิบาย
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="อธิบายหน้าที่และความสามารถของ Agent นี้..."
          rows={3}
          maxLength={300}
          disabled={creating}
          className="resize-none rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-blue-900"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={creating}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {creating ? (
            <>
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              กำลังสร้าง...
            </>
          ) : (
            "สร้าง Agent"
          )}
        </button>
        <button
          type="button"
          onClick={() => router.push("/")}
          disabled={creating}
          className="rounded-xl border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          ยกเลิก
        </button>
      </div>
    </form>
  );
}
