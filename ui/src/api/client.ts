import type { GraphSnapshot, HealthResult, Inspection, RecallResult, Room, Session } from "./types";

const headers = { "Content-Type": "application/json" };

async function read<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(body.detail || response.statusText);
  }
  return response.json() as Promise<T>;
}

export const api = {
  createSession: () => fetch("/api/sessions", { method: "POST" }).then(read<Session>),
  getSession: (sessionId: string) => fetch(`/api/sessions/${sessionId}`).then(read<Session>),
  reset: (sessionId: string) => fetch(`/api/sessions/${sessionId}/reset`, { method: "POST" }).then(read<Session>),
  fastForward: (sessionId: string) => fetch(`/api/sessions/${sessionId}/demo/fast-forward`, { method: "POST" }).then(read<Session>),
  room: (sessionId: string) => fetch(`/api/sessions/${sessionId}/room`).then(read<Room>),
  inspect: (sessionId: string, objectId: string) =>
    fetch(`/api/sessions/${sessionId}/objects/${objectId}/inspect`, { method: "POST" }).then(read<Inspection>),
  commit: (sessionId: string, objectId: string, candidateId: string) =>
    fetch(`/api/sessions/${sessionId}/memories/commit`, {
      method: "POST",
      headers,
      body: JSON.stringify({ object_id: objectId, candidate_id: candidateId })
    }).then(read<{ memory: unknown }>),
  exitRoom: (sessionId: string, roomId: string) =>
    fetch(`/api/sessions/${sessionId}/rooms/${roomId}/exit`, { method: "POST" }).then(read<Room>),
  ask: (sessionId: string, question: string) =>
    fetch(`/api/sessions/${sessionId}/echo/ask`, {
      method: "POST",
      headers,
      body: JSON.stringify({ question })
    }).then(read<RecallResult>),
  graph: (sessionId: string) => fetch(`/api/sessions/${sessionId}/echo/graph`).then(read<GraphSnapshot>),
  memory: (sessionId: string, memoryId: string) =>
    fetch(`/api/sessions/${sessionId}/echo/memories/${memoryId}`).then(read<unknown>),
  dismiss: (sessionId: string, memoryId: string) =>
    fetch(`/api/sessions/${sessionId}/echo/memories/${memoryId}/dismiss`, { method: "POST" }).then(read<GraphSnapshot>),
  health: () => fetch("/api/health").then(read<HealthResult>)
};
