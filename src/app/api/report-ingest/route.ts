// Weekly report ingest for n8n. Deliberately outside /reports/* so it is not
// behind basic auth: n8n authenticates with the X-Ingest-Secret header
// matching the REPORT_INGEST_SECRET environment variable instead.

import { NextResponse, type NextRequest } from "next/server";
import { applyManualFigures, type WeeklyReport } from "@/lib/reports";
import { readStoredReport, writeStoredReport } from "@/lib/reports-store";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const secret = process.env.REPORT_INGEST_SECRET;
  const supplied = req.headers.get("x-ingest-secret");
  // No body detail on auth failure, including when the secret is unconfigured.
  if (!secret || !supplied || supplied !== secret) {
    return new NextResponse(null, { status: 401 });
  }

  let incoming: WeeklyReport;
  try {
    incoming = (await req.json()) as WeeklyReport;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Body must be JSON." },
      { status: 400 }
    );
  }

  if (
    !incoming ||
    typeof incoming !== "object" ||
    typeof incoming.generatedAt !== "string" ||
    !incoming.generatedAt ||
    !incoming.brands ||
    typeof incoming.brands !== "object"
  ) {
    return NextResponse.json(
      { ok: false, error: "Payload must include generatedAt and brands." },
      { status: 400 }
    );
  }

  const stored = await readStoredReport();

  // A Monday n8n run must not wipe figures entered on Sunday: keep every
  // stored manual value the incoming payload leaves null or omits.
  const manual = { ...(incoming.manual ?? {}) };
  if (stored?.manual) {
    for (const [key, storedValue] of Object.entries(stored.manual)) {
      if (storedValue?.value == null) continue;
      if (manual[key]?.value == null) manual[key] = storedValue;
    }
  }

  const next: WeeklyReport = { ...incoming, manual };
  delete next.isSample;
  // Re-apply preserved manual figures to their metric rows so they stay
  // visible on the dashboard after a re-ingest.
  applyManualFigures(next);

  try {
    await writeStoredReport(next);
  } catch (error) {
    console.error("Report ingest: failed to write blob.", error);
    return NextResponse.json(
      { ok: false, error: "Storage unavailable." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
