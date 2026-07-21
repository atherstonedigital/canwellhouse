// Saves manually entered till and showroom figures. Lives under /reports so
// the basic-auth edge function protects it. Merges values into the stored
// payload's manual object and patches the matching metric rows.

import { NextResponse, type NextRequest } from "next/server";
import {
  applyManualFigures,
  MANUAL_METRIC_MAP,
  type ManualKey,
  type WeeklyReport,
} from "@/lib/reports";
import { readStoredReport, writeStoredReport } from "@/lib/reports-store";

export const dynamic = "force-dynamic";

type ManualSubmission = Partial<Record<ManualKey, number | null>>;

const fail = (error: string, status = 400) =>
  NextResponse.json({ ok: false, error }, { status });

export async function POST(req: NextRequest) {
  let body: ManualSubmission;
  try {
    body = (await req.json()) as ManualSubmission;
  } catch {
    return fail("Body must be JSON.");
  }

  const updates: Partial<Record<ManualKey, number>> = {};
  for (const key of Object.keys(MANUAL_METRIC_MAP) as ManualKey[]) {
    const value = body[key];
    if (value == null) continue; // blank field: keep the stored value
    if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
      return fail(`"${key}" must be a non-negative number.`);
    }
    updates[key] = value;
  }

  if (Object.keys(updates).length === 0) {
    return fail("No figures supplied.");
  }

  // Before the first n8n ingest there is no stored payload; seed one from the
  // sample so entered figures round-trip to the dashboard. isSample stays set
  // until a real ingest overwrites it, keeping the sample banner honest.
  let report = await readStoredReport();
  if (!report) {
    const { default: sample } = await import(
      "../../../../../data/report-sample.json"
    );
    report = { ...(sample as unknown as WeeklyReport), isSample: true };
  }

  report.manual = { ...(report.manual ?? {}) };
  for (const [key, value] of Object.entries(updates)) {
    report.manual[key] = { ...report.manual[key], value };
  }
  applyManualFigures(report);

  try {
    await writeStoredReport(report);
  } catch (error) {
    console.error("Manual entry: failed to write blob.", error);
    return fail("Storage unavailable. Figures were not saved.", 500);
  }

  return NextResponse.json({ ok: true, manual: report.manual });
}
