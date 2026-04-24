import { Agent, AgentStatus, CreateAgentInput } from "@/types/agent";

const STORAGE_KEY = "agenthub_agents";

export function loadAgents(): Agent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Agent[]) : [];
  } catch {
    return [];
  }
}

export function saveAgents(agents: Agent[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(agents));
}

export function createAgent(input: CreateAgentInput): Agent {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    name: input.name,
    description: input.description,
    type: input.type,
    status: "pending",
    createdAt: now,
    updatedAt: now,
    progress: 0,
  };
}

export function updateAgentStatus(
  agents: Agent[],
  id: string,
  status: AgentStatus,
  extra?: Partial<Agent>
): Agent[] {
  return agents.map((a) =>
    a.id === id
      ? { ...a, status, updatedAt: new Date().toISOString(), ...extra }
      : a
  );
}

export function deleteAgent(agents: Agent[], id: string): Agent[] {
  return agents.filter((a) => a.id !== id);
}

export const AGENT_TYPE_LABELS: Record<string, string> = {
  "text-generation": "สร้างข้อความ",
  summarization: "สรุปเนื้อหา",
  translation: "แปลภาษา",
  classification: "จัดประเภท",
  "question-answering": "ตอบคำถาม",
  custom: "กำหนดเอง",
};

export const STATUS_LABELS: Record<AgentStatus, string> = {
  pending: "รอดำเนินการ",
  processing: "กำลังประมวลผล",
  completed: "เสร็จสิ้น",
  failed: "ล้มเหลว",
};
