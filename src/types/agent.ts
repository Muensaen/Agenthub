export type AgentStatus = "pending" | "processing" | "completed" | "failed";

export type AgentType =
  | "text-generation"
  | "summarization"
  | "translation"
  | "classification"
  | "question-answering"
  | "custom";

export interface Agent {
  id: string;
  name: string;
  description: string;
  type: AgentType;
  status: AgentStatus;
  createdAt: string;
  updatedAt: string;
  progress?: number; // 0–100, only relevant when status is "processing"
  result?: string;
  errorMessage?: string;
}

export interface CreateAgentInput {
  name: string;
  description: string;
  type: AgentType;
}
