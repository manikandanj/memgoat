import type { HotspotSummary } from "../api/types";

export function hotspotColor(hotspot: HotspotSummary): string {
  if (hotspot.examined) return "#77c39d";
  if (hotspot.kind === "marking") return "#d7b56d";
  if (hotspot.kind === "door") return "#d96f66";
  return "#e2e6cf";
}
