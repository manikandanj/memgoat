import { DoorOpen } from "lucide-react";
import { useGameStore } from "../state/gameStore";

export function RecallBox() {
  const recall = useGameStore((state) => state.recall);
  if (!recall) {
    return <section className="recall-box empty">The Echo has not been asked yet.</section>;
  }
  return (
    <section className={recall.final_open ? "recall-box final" : "recall-box"}>
      <p>{recall.answer}</p>
      <small>Certainty {Math.round(recall.certainty * 100)}% · Trace {recall.trace_id}</small>
      {recall.final_open && recall.final_line && (
        <div className="final-line">
          <DoorOpen size={18} />
          <strong>{recall.final_line}</strong>
        </div>
      )}
    </section>
  );
}
