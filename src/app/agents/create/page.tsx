"use client";

import Link from "next/link";
import CreateAgentForm from "@/components/CreateAgentForm";
import { CreateAgentInput } from "@/types/agent";
import { createAgent, loadAgents, saveAgents } from "@/lib/agents";

export default function CreateAgentPage() {
  function handleSubmit(input: CreateAgentInput) {
    const agent = createAgent(input);
    const existing = loadAgents();
    saveAgents([agent, ...existing]);
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-800 dark:hover:text-zinc-200"
          >
            ← กลับ
          </Link>
          <span className="text-zinc-300 dark:text-zinc-600">/</span>
          <h1 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
            สร้าง Agent ใหม่
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-6 py-10">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            สร้าง Agent
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            กรอกข้อมูลด้านล่างเพื่อสร้าง AI Agent ใหม่
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
          <CreateAgentForm onSubmit={handleSubmit} />
        </div>
      </main>
    </div>
  );
}
