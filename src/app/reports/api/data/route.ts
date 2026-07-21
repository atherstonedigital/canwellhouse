// Read endpoint for the dashboard. Lives under /reports so the basic-auth
// edge function protects it. Serves the stored blob, or the bundled sample
// payload (flagged isSample) before the first real ingest.

import { NextResponse } from "next/server";
import type { WeeklyReport } from "@/lib/reports";
import { readStoredReport } from "@/lib/reports-store";
import sample from "../../../../../data/report-sample.json";

export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

export async function GET() {
  const stored = await readStoredReport();
  if (stored) {
    return NextResponse.json(stored, { headers: NO_STORE });
  }
  const fallback: WeeklyReport = {
    ...(sample as unknown as WeeklyReport),
    isSample: true,
  };
  return NextResponse.json(fallback, { headers: NO_STORE });
}
