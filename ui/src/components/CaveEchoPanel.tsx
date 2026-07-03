import { HelpCircle, RotateCcw, Send, StepForward } from "lucide-react";
import { FormEvent, useState } from "react";
import { useGameStore } from "../state/gameStore";
import { CountdownTimer } from "./CountdownTimer";
import { DemoControls } from "./DemoControls";
import { MemoryDetails } from "./MemoryDetails";
import { MemoryGraph } from "./MemoryGraph";
import { RecallBox } from "./RecallBox";

export function CaveEchoPanel() {
  const [question, setQuestion] = useState("What do I know?");
  const { session, room, ask, reset, exitRoom, demoVisible } = useGameStore();

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void ask(question);
  }

  return (
    <aside className="echo-panel" aria-label="Cave Echo panel">
      <header className="echo-header">
        <div>
          <h1>MemGoat</h1>
          <p>{room?.title ?? "Starting"}</p>
        </div>
        <CountdownTimer />
      </header>

      <div className="session-row">
        <span>Resets {session?.reset_count ?? 0}</span>
        <span>{room?.sealed_rooms.length ? `Sealed ${room.sealed_rooms.join(", ")}` : "No sealed rooms"}</span>
      </div>

      <section className="goat-context">
        <HelpCircle size={18} aria-hidden />
        <p>{room?.goat_context ?? "The goat is waking."}</p>
      </section>

      <MemoryGraph />

      <form className="recall-form" onSubmit={onSubmit}>
        <label htmlFor="echo-question">Ask the Cave Echo</label>
        <div>
          <input id="echo-question" value={question} onChange={(event) => setQuestion(event.target.value)} />
          <button type="submit" aria-label="Ask Echo">
            <Send size={18} />
          </button>
        </div>
      </form>

      <RecallBox />
      <MemoryDetails />

      <div className="primary-actions">
        <button type="button" onClick={() => void reset()}>
          <RotateCcw size={18} />
          Reset
        </button>
        <button type="button" onClick={() => void exitRoom()} disabled={!room?.exits.length}>
          <StepForward size={18} />
          {room?.exits[0]?.label ?? "No exit"}
        </button>
      </div>

      {demoVisible && <DemoControls />}
    </aside>
  );
}
