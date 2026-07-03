import { Activity, FastForward, RotateCcw } from "lucide-react";
import { useGameStore } from "../state/gameStore";

export function DemoControls() {
  const { fastForward, reset, preflight, health } = useGameStore();
  return (
    <section className="demo-controls" aria-label="Demo controls">
      <button type="button" onClick={() => void reset()}>
        <RotateCcw size={16} />
        Reset now
      </button>
      <button type="button" onClick={() => void fastForward()}>
        <FastForward size={16} />
        Fast-forward
      </button>
      <button type="button" onClick={() => void preflight()}>
        <Activity size={16} />
        Preflight
      </button>
      {health && (
        <p className={health.demo_ready ? "health-ready" : "health-issue"}>
          {health.provider}: {health.detail}
        </p>
      )}
    </section>
  );
}
