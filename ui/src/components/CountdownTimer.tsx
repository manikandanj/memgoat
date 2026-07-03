import { Timer } from "lucide-react";
import { useGameStore } from "../state/gameStore";

export function CountdownTimer() {
  const seconds = useGameStore((state) => state.secondsRemaining);
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  const warning = seconds <= 20;
  return (
    <div className={warning ? "timer warning" : "timer"} aria-live={warning ? "assertive" : "polite"}>
      <Timer size={18} />
      <span>
        {minutes}:{rest.toString().padStart(2, "0")}
      </span>
    </div>
  );
}
