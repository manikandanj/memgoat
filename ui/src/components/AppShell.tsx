import { useEffect } from "react";
import { CaveDiorama } from "../game/CaveDiorama";
import { useGameStore } from "../state/gameStore";
import { CaveEchoPanel } from "./CaveEchoPanel";
import { InspectionPanel } from "./InspectionPanel";

export function AppShell() {
  const { start, room, inspection, tick, toggleDemo, status, busy } = useGameStore();

  useEffect(() => {
    void start();
  }, [start]);

  useEffect(() => {
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [tick]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "d") {
        event.preventDefault();
        toggleDemo();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleDemo]);

  return (
    <main className="app-shell">
      <CaveDiorama room={room} />
      <CaveEchoPanel />
      {inspection && <InspectionPanel inspection={inspection} />}
      <div className="status-strip" role="status">
        {busy ? "Working..." : status}
      </div>
    </main>
  );
}
