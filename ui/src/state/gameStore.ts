import { create } from "zustand";
import { api } from "../api/client";
import type { GraphSnapshot, HealthResult, Inspection, RecallResult, Room, Session } from "../api/types";

interface GameState {
  session: Session | null;
  room: Room | null;
  inspection: Inspection | null;
  graph: GraphSnapshot;
  recall: RecallResult | null;
  health: HealthResult | null;
  selectedMemoryId: string | null;
  highlightedPath: { nodes: string[]; edges: string[] };
  secondsRemaining: number;
  demoVisible: boolean;
  busy: boolean;
  status: string;
  start: () => Promise<void>;
  refresh: () => Promise<void>;
  inspect: (objectId: string) => Promise<void>;
  commit: (candidateId: string) => Promise<void>;
  exitRoom: () => Promise<void>;
  reset: () => Promise<void>;
  fastForward: () => Promise<void>;
  ask: (question: string) => Promise<void>;
  dismiss: (memoryId: string) => Promise<void>;
  preflight: () => Promise<void>;
  selectMemory: (memoryId: string | null) => void;
  closeInspection: () => void;
  tick: () => void;
  toggleDemo: () => void;
}

const emptyGraph: GraphSnapshot = { nodes: [], edges: [], memories: [] };

export const useGameStore = create<GameState>((set, get) => ({
  session: null,
  room: null,
  inspection: null,
  graph: emptyGraph,
  recall: null,
  health: null,
  selectedMemoryId: null,
  highlightedPath: { nodes: [], edges: [] },
  secondsRemaining: 120,
  demoVisible: false,
  busy: false,
  status: "Starting session...",
  start: async () => {
    if (get().session || get().busy) return;
    set({ busy: true, status: "Opening the cave..." });
    const session = await api.createSession();
    const [room, graph] = await Promise.all([api.room(session.id), api.graph(session.id)]);
    set({ session, room, graph, secondsRemaining: session.timer_seconds, busy: false, status: "Choose what the Cave Echo should remember." });
  },
  refresh: async () => {
    const session = get().session;
    if (!session) return;
    const [freshSession, room, graph] = await Promise.all([api.getSession(session.id), api.room(session.id), api.graph(session.id)]);
    set({ session: freshSession, room, graph });
  },
  inspect: async (objectId: string) => {
    const session = get().session;
    if (!session) return;
    set({ busy: true, status: "Inspecting object..." });
    const inspection = await api.inspect(session.id, objectId);
    set({ inspection, busy: false, status: "Pick the memory that should survive the next reset." });
  },
  commit: async (candidateId: string) => {
    const { session, inspection } = get();
    if (!session || !inspection) return;
    set({ busy: true, status: "Committing memory to the Cave Echo..." });
    await api.commit(session.id, inspection.object_id, candidateId);
    const [room, graph] = await Promise.all([api.room(session.id), api.graph(session.id)]);
    set({ room, graph, inspection: null, busy: false, status: "Memory committed. The Echo graph changed." });
  },
  exitRoom: async () => {
    const { session, room } = get();
    if (!session || !room) return;
    set({ busy: true, status: "Crossing the threshold..." });
    const nextRoom = await api.exitRoom(session.id, room.id);
    const graph = await api.graph(session.id);
    set({ room: nextRoom, graph, inspection: null, busy: false, status: `${room.title} sealed behind you.` });
  },
  reset: async () => {
    const session = get().session;
    if (!session) return;
    set({ busy: true, status: "The goat forgets. The Echo holds." });
    const resetSession = await api.reset(session.id);
    const [room, graph] = await Promise.all([api.room(resetSession.id), api.graph(resetSession.id)]);
    set({ session: resetSession, room, graph, inspection: null, secondsRemaining: resetSession.timer_seconds, busy: false });
  },
  fastForward: async () => {
    const session = get().session;
    if (!session) return;
    const resetSession = await api.fastForward(session.id);
    const [room, graph] = await Promise.all([api.room(resetSession.id), api.graph(resetSession.id)]);
    set({ session: resetSession, room, graph, inspection: null, secondsRemaining: resetSession.timer_seconds, status: "Presenter fast-forward triggered a reset." });
  },
  ask: async (question: string) => {
    const session = get().session;
    if (!session || !question.trim()) return;
    set({ busy: true, status: "Asking the Cave Echo..." });
    const recall = await api.ask(session.id, question);
    const graph = await api.graph(session.id);
    set({
      recall,
      graph,
      highlightedPath: { nodes: recall.path_nodes, edges: recall.path_edges },
      busy: false,
      status: recall.final_open ? "The Root Gate opens." : "The Echo answered from committed memory."
    });
  },
  dismiss: async (memoryId: string) => {
    const session = get().session;
    if (!session) return;
    const graph = await api.dismiss(session.id, memoryId);
    set({ graph, selectedMemoryId: null, status: "Suspicious memory dismissed from future recall." });
  },
  preflight: async () => {
    const health = await api.health();
    set({ health, status: health.demo_ready ? "Preflight ready." : `Preflight issue: ${health.detail}` });
  },
  selectMemory: (memoryId: string | null) => set({ selectedMemoryId: memoryId }),
  closeInspection: () => set({ inspection: null }),
  tick: () => {
    const next = Math.max(0, get().secondsRemaining - 1);
    set({ secondsRemaining: next });
    if (next === 0) {
      void get().reset();
    }
  },
  toggleDemo: () => set({ demoVisible: !get().demoVisible })
}));
