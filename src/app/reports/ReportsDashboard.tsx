"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type {
  BrandKey,
  Metric,
  MetricFormat,
  RangeKey,
  WeeklyReport,
} from "@/lib/reports";

const BRAND_ORDER: BrandKey[] = ["xshowhome", "canwell", "saverys"];

const RANGE_LABELS: Record<RangeKey, string> = {
  "7d": "7 days",
  "30d": "30 days",
  qtd: "Quarter",
};

function formatValue(value: number | null, format: MetricFormat): string {
  if (value == null) return "—";
  switch (format) {
    case "int":
      return value.toLocaleString("en-GB");
    case "gbp":
      return `£${value.toLocaleString("en-GB", {
        minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
        maximumFractionDigits: 2,
      })}`;
    case "pct":
      return `${value.toLocaleString("en-GB", { maximumFractionDigits: 2 })}%`;
    case "pp":
      return `${value.toLocaleString("en-GB", { maximumFractionDigits: 2 })}pp`;
    case "ratio":
      return value.toLocaleString("en-GB", { maximumFractionDigits: 2 });
    default:
      return String(value);
  }
}

function formatGeneratedAt(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function deltaClass(delta: string): string {
  if (delta.startsWith("+")) return "text-[#8FAE8B]";
  if (delta.startsWith("-") || delta.startsWith("−")) return "text-[#C08A80]";
  return "text-[--on-dark-muted]";
}

function MetricRow({ metric }: { metric: Metric }) {
  if (metric.current == null && metric.note) {
    return (
      <li className="flex items-baseline justify-between gap-4 border-b border-white/10 py-3">
        <span className="text-sm text-[--on-dark-muted]">{metric.label}</span>
        <span className="text-right text-sm italic text-[--on-dark-muted]">
          {metric.note}
        </span>
      </li>
    );
  }
  return (
    <li className="flex items-baseline justify-between gap-4 border-b border-white/10 py-3">
      <span className="text-sm text-[--on-dark-muted]">{metric.label}</span>
      <span className="text-right">
        <span className="block text-lg font-medium tabular-nums">
          {formatValue(metric.current, metric.format)}
        </span>
        <span className="block text-xs tabular-nums text-[--on-dark-muted]">
          prior {formatValue(metric.prior, metric.format)}
          {metric.delta ? (
            <>
              {" · "}
              <span className={deltaClass(metric.delta)}>{metric.delta}</span>
            </>
          ) : null}
        </span>
        {metric.note ? (
          <span className="block text-xs italic text-[--on-dark-muted]">
            {metric.note}
          </span>
        ) : null}
      </span>
    </li>
  );
}

export default function ReportsDashboard() {
  const [report, setReport] = useState<WeeklyReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeBrand, setActiveBrand] = useState<BrandKey>("xshowhome");
  const [activeRange, setActiveRange] = useState<RangeKey>("7d");

  useEffect(() => {
    let cancelled = false;
    fetch("/reports/api/data", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        return res.json();
      })
      .then((data: WeeklyReport) => {
        if (!cancelled) setReport(data);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load report data. Refresh to retry.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const brands = BRAND_ORDER.filter((key) => report?.brands?.[key]);
  const brand = report?.brands?.[activeBrand];
  const range = brand?.ranges?.[activeRange];

  return (
    <main className="mx-auto min-h-screen w-full max-w-2xl px-5 py-8 sm:py-12">
      <header className="border-b border-[--color-gold]/40 pb-5">
        <p className="text-[length:--text-eyebrow] uppercase tracking-[0.2em] text-[--color-gold]">
          House of Canwell
        </p>
        <div className="mt-1 flex items-baseline justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl">Weekly reports</h1>
          <Link
            href="/reports/entry"
            className="shrink-0 text-sm text-[--color-gold] underline underline-offset-4"
          >
            Manual entry
          </Link>
        </div>
        {report ? (
          <p className="mt-2 text-xs text-[--on-dark-muted]">
            Data generated {formatGeneratedAt(report.generatedAt)} UK
          </p>
        ) : null}
      </header>

      {report?.isSample ? (
        <p
          role="status"
          className="mt-5 rounded border border-[#B98A3A]/50 bg-[#B98A3A]/15 px-4 py-3 text-sm text-[#E3B65F]"
        >
          Sample data. Live feed not yet connected.
        </p>
      ) : null}

      {error ? (
        <p role="alert" className="mt-8 text-sm text-[#C08A80]">
          {error}
        </p>
      ) : null}

      {!report && !error ? (
        <p className="mt-8 text-sm text-[--on-dark-muted]">Loading…</p>
      ) : null}

      {report ? (
        <>
          <nav aria-label="Brand" className="mt-6 flex gap-2 overflow-x-auto">
            {brands.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveBrand(key)}
                aria-pressed={activeBrand === key}
                className={`shrink-0 rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  activeBrand === key
                    ? "border-[--color-gold] text-[--color-stone]"
                    : "border-white/15 text-[--on-dark-muted]"
                }`}
              >
                {report.brands?.[key]?.label ?? key}
              </button>
            ))}
          </nav>

          <div
            role="group"
            aria-label="Range"
            className="mt-4 inline-flex rounded border border-white/15"
          >
            {(Object.keys(RANGE_LABELS) as RangeKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveRange(key)}
                aria-pressed={activeRange === key}
                className={`px-3.5 py-1.5 text-sm ${
                  activeRange === key
                    ? "bg-white/10 text-[--color-stone]"
                    : "text-[--on-dark-muted]"
                }`}
              >
                {RANGE_LABELS[key]}
              </button>
            ))}
          </div>

          {range ? (
            <section className="mt-6">
              <p className="text-xs text-[--on-dark-muted]">
                {range.period}
                {range.prior ? ` · prior ${range.prior}` : ""}
              </p>
              <ul className="mt-2">
                {range.metrics.map((metric) => (
                  <MetricRow key={metric.key} metric={metric} />
                ))}
              </ul>
            </section>
          ) : (
            <p className="mt-8 text-sm italic text-[--on-dark-muted]">
              No data for this range yet.
            </p>
          )}

          {activeBrand === "xshowhome" ? (
            <p className="mt-6 text-xs italic text-[--on-dark-muted]">
              Site metrics from GA4; understated due to known tracking gap.
            </p>
          ) : null}
        </>
      ) : null}
    </main>
  );
}
