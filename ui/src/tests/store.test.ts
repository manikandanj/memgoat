import { describe, expect, it } from "vitest";
import { useGameStore } from "../state/gameStore";

describe("game store timer", () => {
  it("counts down without going below zero", () => {
    useGameStore.setState({ secondsRemaining: 1, session: null });
    useGameStore.getState().tick();
    useGameStore.getState().tick();
    expect(useGameStore.getState().secondsRemaining).toBe(0);
  });

  it("toggles demo controls", () => {
    useGameStore.setState({ demoVisible: false });
    useGameStore.getState().toggleDemo();
    expect(useGameStore.getState().demoVisible).toBe(true);
  });
});
