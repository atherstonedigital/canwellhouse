// Types for the weekly report payload posted by n8n, plus the mapping between
// manually entered figures and the metric rows they fill. Shared by the API
// routes (server) and the dashboard/entry pages (client) — keep this file free
// of server-only imports.

export type MetricFormat = "int" | "gbp" | "pct" | "pp" | "ratio";

export type Metric = {
  key: string;
  label: string;
  current: number | null;
  prior: number | null;
  format: MetricFormat;
  delta: string | null;
  note: string | null;
};

export type RangeKey = "7d" | "30d" | "qtd";

export type ReportRange = {
  period: string;
  prior: string;
  metrics: Metric[];
};

export type BrandKey = "xshowhome" | "canwell" | "saverys";

export type BrandReport = {
  label: string;
  ranges: Partial<Record<RangeKey, ReportRange>>;
};

export type ManualValue = {
  value: number | null;
  note?: string | null;
};

export type ManualKey = "canwellTillMtd" | "saverysLudlow" | "saverysBroadway";

export type WeeklyReport = {
  generatedAt: string;
  brands: Partial<Record<BrandKey, BrandReport>>;
  manual: Record<string, ManualValue>;
  // Set when serving placeholder data before the first real ingest.
  isSample?: boolean;
};

export const MANUAL_METRIC_MAP: Record<
  ManualKey,
  { brand: BrandKey; metricKey: string }
> = {
  canwellTillMtd: { brand: "canwell", metricKey: "canwell_till_mtd" },
  saverysLudlow: { brand: "saverys", metricKey: "saverys_ludlow" },
  saverysBroadway: { brand: "saverys", metricKey: "saverys_broadway" },
};

// Copies non-null manual figures onto their matching metric rows across every
// range of the owning brand, clearing the "awaiting figure" note. Mutates the
// report in place.
export function applyManualFigures(report: WeeklyReport): void {
  for (const [manualKey, target] of Object.entries(MANUAL_METRIC_MAP) as [
    ManualKey,
    { brand: BrandKey; metricKey: string },
  ][]) {
    const value = report.manual?.[manualKey]?.value;
    if (value == null) continue;
    const ranges = report.brands?.[target.brand]?.ranges;
    if (!ranges) continue;
    for (const range of Object.values(ranges)) {
      for (const metric of range?.metrics ?? []) {
        if (metric.key === target.metricKey) {
          metric.current = value;
          metric.note = null;
        }
      }
    }
  }
}
