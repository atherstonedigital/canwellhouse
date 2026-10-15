"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import type { ManualKey, WeeklyReport } from "@/lib/reports";

const FIELDS: { key: ManualKey; label: string }[] = [
  { key: "canwellTillMtd", label: "Canwell till revenue MTD (£)" },
  { key: "saverysLudlow", label: "Saverys Ludlow week (£)" },
  { key: "saverysBroadway", label: "Saverys Broadway week (£)" },
];

type Status =
  | { state: "idle" | "loading" | "saving" }
  | { state: "saved" }
  | { state: "error"; message: string };

export default function EntryForm() {
  const [values, setValues] = useState<Record<ManualKey, string>>({
    canwellTillMtd: "",
    saverysLudlow: "",
    saverysBroadway: "",
  });
  const [status, setStatus] = useState<Status>({ state: "loading" });

  // Pre-fill with stored figures so an update overwrites knowingly.
  useEffect(() => {
    let cancelled = false;
    fetch("/reports/api/data", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: WeeklyReport | null) => {
        if (cancelled) return;
        if (data?.manual) {
          setValues((prev) => {
            const next = { ...prev };
            for (const { key } of FIELDS) {
              const stored = data.manual[key]?.value;
              if (stored != null) next[key] = String(stored);
            }
            return next;
          });
        }
        setStatus({ state: "idle" });
      })
      .catch(() => {
        if (!cancelled) setStatus({ state: "idle" });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ state: "saving" });

    const payload: Partial<Record<ManualKey, number>> = {};
    for (const { key } of FIELDS) {
      const raw = values[key].trim();
      if (raw === "") continue;
      const parsed = Number(raw);
      if (!Number.isFinite(parsed) || parsed < 0) {
        setStatus({
          state: "error",
          message: "Figures must be numbers, zero or above.",
        });
        return;
      }
      payload[key] = parsed;
    }

    if (Object.keys(payload).length === 0) {
      setStatus({ state: "error", message: "Enter at least one figure." });
      return;
    }

    try {
      const res = await fetch("/reports/api/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
      } | null;
      if (!res.ok || !data?.ok) {
        setStatus({
          state: "error",
          message: data?.error ?? "Could not save figures. Try again.",
        });
        return;
      }
      setStatus({ state: "saved" });
    } catch {
      setStatus({ state: "error", message: "Could not save figures. Try again." });
    }
  }

  const busy = status.state === "loading" || status.state === "saving";

  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-5 py-8 sm:py-12">
      <header className="border-b border-[--color-gold]/40 pb-5">
        <p className="text-[length:--text-eyebrow] uppercase tracking-[0.2em] text-[--color-gold]">
          House of Canwell
        </p>
        <h1 className="mt-1 text-2xl sm:text-3xl">Manual entry</h1>
        <p className="mt-2 text-sm text-[--on-dark-muted]">
          Till and showroom figures for the weekly report. Leave a field blank
          to keep the stored value.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {FIELDS.map(({ key, label }) => (
          <label key={key} className="block">
            <span className="text-sm text-[--on-dark-muted]">{label}</span>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={values[key]}
              onChange={(event) =>
                setValues((prev) => ({ ...prev, [key]: event.target.value }))
              }
              disabled={busy}
              className="mt-1 w-full rounded border border-white/20 bg-white/5 px-3 py-2.5 text-base text-[--color-stone] outline-none focus:border-[--color-gold] disabled:opacity-50"
            />
          </label>
        ))}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded border border-[--color-gold] px-4 py-2.5 text-sm uppercase tracking-[0.15em] text-[--color-gold] transition-colors hover:bg-[--color-gold] hover:text-[--color-petrol] disabled:opacity-50"
        >
          {status.state === "saving" ? "Saving…" : "Save figures"}
        </button>
      </form>

      {status.state === "saved" ? (
        <p
          role="status"
          className="mt-5 rounded border border-[#8FAE8B]/40 bg-[#8FAE8B]/10 px-4 py-3 text-sm text-[#8FAE8B]"
        >
          Saved. The figures now show on the{" "}
          <Link href="/reports" className="underline underline-offset-4">
            dashboard
          </Link>
          .
        </p>
      ) : null}

      {status.state === "error" ? (
        <p
          role="alert"
          className="mt-5 rounded border border-[#C08A80]/40 bg-[#C08A80]/10 px-4 py-3 text-sm text-[#C08A80]"
        >
          {status.message}
        </p>
      ) : null}

      <p className="mt-8 text-sm">
        <Link
          href="/reports"
          className="text-[--color-gold] underline underline-offset-4"
        >
          Back to reports
        </Link>
      </p>
    </main>
  );
}
