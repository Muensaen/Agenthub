"use client";

import { useEffect, useReducer, useRef, useCallback } from "react";
import Link from "next/link";
import { Agent } from "@/types/agent";
import {
  loadAgents,
  saveAgents,
  updateAgentStatus,
  deleteAgent,
  STATUS_LABELS,
} from "@/lib/agents";
import AgentCard from "@/components/AgentCard";

type Action =
  | { type: "init"; agents: Agent[] }
  | { type: "update"; agents: Agent[] };

interface State {
  mounted: boolean;
  agents: Agent[];
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "init":
      return { mounted: true, agents: action.agents };
    case "update":
      return { ...state, agents: action.agents };
    default:
      return state;
  }
}

const MOCK_RESULTS = [
  "ประมวลผลสำเร็จ ข้อมูลพร้อมใช้งาน",
  "วิเคราะห์เสร็จสิ้น ผลลัพธ์ถูกต้อง 98.5%",
  "สร้างเนื้อหาใหม่เรียบร้อยแล้ว",
  "แปลและสรุปข้อมูลเสร็จสมบูรณ์",
];

export default function Home() {
  const [{ mounted, agents }, dispatch] = useReducer(reducer, {
    mounted: false,
    agents: [],
  });

  // Keep a ref so interval callbacks always have the latest agents list
  const agentsRef = useRef<Agent[]>(agents);
  useEffect(() => {
    agentsRef.current = agents;
  });

  useEffect(() => {
    dispatch({ type: "init", agents: loadAgents() });
  }, []);

  // Persist agents to localStorage whenever they change
  useEffect(() => {
    if (mounted) saveAgents(agents);
  }, [agents, mounted]);

  // Track active intervals so they can be cleaned up on unmount
  const intervalsRef = useRef<Map<string, ReturnType<typeof setInterval>>>(
    new Map()
  );

  useEffect(() => {
    const intervals = intervalsRef.current;
    return () => {
      intervals.forEach((id) => clearInterval(id));
      intervals.clear();
    };
  }, []);

  // Simulate processing when an agent runs
  const handleRun = useCallback((id: string) => {
    dispatch({
      type: "update",
      agents: updateAgentStatus(agentsRef.current, id, "processing", {
        progress: 0,
      }),
    });

    let pct = 0;
    const interval = setInterval(() => {
      pct += Math.floor(Math.random() * 18) + 8;
      if (pct >= 100) {
        pct = 100;
        clearInterval(interval);
        intervalsRef.current.delete(id);
        const result =
          MOCK_RESULTS[Math.floor(Math.random() * MOCK_RESULTS.length)];
        dispatch({
          type: "update",
          agents: updateAgentStatus(agentsRef.current, id, "completed", {
            progress: 100,
            result,
          }),
        });
      } else {
        dispatch({
          type: "update",
          agents: updateAgentStatus(agentsRef.current, id, "processing", {
            progress: pct,
          }),
        });
      }
    }, 400);
    intervalsRef.current.set(id, interval);
  }, []);

  const handleDelete = useCallback((id: string) => {
    dispatch({
      type: "update",
      agents: deleteAgent(agentsRef.current, id),
    });
  }, []);

  const counts = agents.reduce(
    (acc, a) => {
      acc[a.status] = (acc[a.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              🤖 AI Agent Hub
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              จัดการและติดตาม AI Agents ของคุณ
            </p>
          </div>
          <Link
            href="/agents/create"
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            <span className="text-base leading-none">+</span>
            สร้าง Agent
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        {/* Stats */}
        {agents.length > 0 && (
          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(["pending", "processing", "completed", "failed"] as const).map(
              (s) => (
                <div
                  key={s}
                  className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900"
                >
                  <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    {counts[s] ?? 0}
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                    {STATUS_LABELS[s]}
                  </p>
                </div>
              )
            )}
          </div>
        )}

        {/* Agent Grid */}
        {agents.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-zinc-300 py-24 text-center dark:border-zinc-700">
            <span className="text-5xl">🤖</span>
            <div>
              <p className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">
                ยังไม่มี Agent
              </p>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                เริ่มต้นโดยการสร้าง Agent ตัวแรกของคุณ
              </p>
            </div>
            <Link
              href="/agents/create"
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              สร้าง Agent แรก
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onRun={handleRun}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
