export type MemoryStatus = "correct" | "incomplete" | "misleading" | "false" | "refined" | "dismissed";

export interface Session {
  id: string;
  chain_id: string;
  current_room_id: string;
  sealed_rooms: string[];
  reset_count: number;
  timer_seconds: number;
  goat_context: string;
}

export interface HotspotSummary {
  id: string;
  label: string;
  kind: string;
  position: [number, number, number];
  examined: boolean;
}

export interface Room {
  id: string;
  title: string;
  summary: string;
  goat_context: string;
  hotspots: HotspotSummary[];
  exits: Array<{ id: string; label: string; to_room_id: string | null; requires_memory_ids: string[] }>;
  sealed_rooms: string[];
}

export interface CandidateMemory {
  id: string;
  title: string;
  text: string;
  status: MemoryStatus;
  category: string;
  confidence: number;
  metadata: Record<string, unknown>;
}

export interface Inspection {
  object_id: string;
  label: string;
  prompt: string;
  observation: string;
  candidates: CandidateMemory[];
}

export interface GraphNode {
  id: string;
  label: string;
  type: string;
  status: MemoryStatus;
  metadata: Record<string, unknown>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  status: MemoryStatus;
  metadata: Record<string, unknown>;
}

export interface MemoryRecord extends CandidateMemory {
  object_id: string;
  room_id: string;
  created_at: string;
}

export interface GraphSnapshot {
  nodes: GraphNode[];
  edges: GraphEdge[];
  memories: MemoryRecord[];
}

export interface RecallResult {
  answer: string;
  certainty: number;
  path_nodes: string[];
  path_edges: string[];
  supporting_memories: string[];
  trace_id: string;
  final_open?: boolean;
  final_line?: string | null;
}

export interface HealthResult {
  ok: boolean;
  provider: string;
  provider_ok: boolean;
  demo_ready: boolean;
  detail: string;
}
