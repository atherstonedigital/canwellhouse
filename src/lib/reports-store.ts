// Server-only access to the Netlify Blobs store that holds the weekly report.
// The Netlify Next.js runtime wires up Blobs credentials automatically in
// deployed route handlers; in bare local dev the store is unavailable, so
// reads fall back to null (callers then serve the bundled sample data).

import { getStore } from "@netlify/blobs";
import type { WeeklyReport } from "./reports";

export const REPORTS_STORE = "reports";
export const REPORT_KEY = "weekly-report.json";

function store() {
  // Strong consistency so a figure saved via /reports/entry is visible on the
  // very next dashboard load.
  return getStore({ name: REPORTS_STORE, consistency: "strong" });
}

export async function readStoredReport(): Promise<WeeklyReport | null> {
  try {
    const data = await store().get(REPORT_KEY, { type: "json" });
    return (data as WeeklyReport) ?? null;
  } catch {
    return null;
  }
}

export async function writeStoredReport(report: WeeklyReport): Promise<void> {
  await store().setJSON(REPORT_KEY, report);
}
