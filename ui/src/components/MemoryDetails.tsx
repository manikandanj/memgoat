import { AlertTriangle, Trash2 } from "lucide-react";
import { useGameStore } from "../state/gameStore";

export function MemoryDetails() {
  const { graph, selectedMemoryId, dismiss } = useGameStore();
  const memory = graph.memories.find((item) => item.id === selectedMemoryId || item.id === graph.nodes.find((node) => node.id === selectedMemoryId)?.id);
  const related = memory ?? graph.memories.find((item) => item.id === selectedMemoryId);

  if (!selectedMemoryId) {
    return <section className="memory-details empty">Select a graph node to inspect its source.</section>;
  }

  const target = related;
  if (!target) {
    return <section className="memory-details empty">This graph node is a linked entity, not a committed memory.</section>;
  }

  const suspicious = target.status === "false" || target.category === "false-memory";
  return (
    <section className={`memory-details ${target.status}`}>
      <h2>{target.title}</h2>
      <p>{target.text}</p>
      <dl>
        <div>
          <dt>Status</dt>
          <dd>{target.status}</dd>
        </div>
        <div>
          <dt>Confidence</dt>
          <dd>{Math.round(target.confidence * 100)}%</dd>
        </div>
      </dl>
      {suspicious && (
        <button type="button" className="dismiss-button" onClick={() => window.confirm("Dismiss this suspicious memory from future recall?") && void dismiss(target.id)}>
          <AlertTriangle size={16} />
          <Trash2 size={16} />
          Dismiss memory
        </button>
      )}
    </section>
  );
}
