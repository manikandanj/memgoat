import { X } from "lucide-react";
import type { Inspection } from "../api/types";
import { useGameStore } from "../state/gameStore";

export function InspectionPanel({ inspection }: { inspection: Inspection }) {
  const commit = useGameStore((state) => state.commit);
  const close = useGameStore((state) => state.closeInspection);

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="inspection-panel" role="dialog" aria-modal="true" aria-labelledby="inspection-title">
        <header>
          <div>
            <h2 id="inspection-title">{inspection.label}</h2>
            <p>{inspection.prompt}</p>
          </div>
          <button type="button" aria-label="Close inspection" onClick={close}>
            <X size={18} />
          </button>
        </header>
        <p className="observation">{inspection.observation}</p>
        <div className="candidate-list">
          {inspection.candidates.map((candidate) => (
            <button key={candidate.id} type="button" className={`candidate ${candidate.status}`} onClick={() => void commit(candidate.id)}>
              <strong>{candidate.title}</strong>
              <span>{candidate.text}</span>
              <small>{candidate.status} - {Math.round(candidate.confidence * 100)}%</small>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
