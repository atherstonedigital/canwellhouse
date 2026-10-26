"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Turnstile from "@/components/ui/Turnstile";
import { home } from "@/lib/content";

type Status = "idle" | "submitting" | "success" | "error";

const copy = home.enquiries.form;

export default function ContactForm({ autoFocus = false }: { autoFocus?: boolean }) {
  const uid = useId();
  const firstField = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [token, setToken] = useState("");

  const handleToken = useCallback((value: string) => setToken(value), []);

  useEffect(() => {
    if (autoFocus) firstField.current?.focus();
  }, [autoFocus]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const fd = new FormData(event.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      enquiryType: String(fd.get("enquiry-type") ?? ""),
      message: String(fd.get("message") ?? ""),
      botField: String(fd.get("bot-field") ?? ""),
      token,
    };

    if (!token) {
      setError(copy.verificationError);
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !result.ok) {
        throw new Error(result.error ?? "Something went wrong.");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="border-t border-[#758075] pt-6">
        <p className="font-display text-[1.75rem] leading-tight">{copy.successHeading}</p>
        <p className="mt-2 text-[0.8125rem] text-[#cbd1c6]">{copy.successBody}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="grid gap-4 border-t border-[#758075] pt-6 sm:grid-cols-2"
    >
      {/* Honeypot: visually hidden, off the tab order. */}
      <p hidden aria-hidden="true">
        <label>
          Leave this empty
          <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <label htmlFor={`${uid}-name`} className="grid gap-1.5 text-[0.75rem]">
        {copy.nameLabel}
        <input
          ref={firstField}
          id={`${uid}-name`}
          name="name"
          autoComplete="name"
          required
          placeholder={copy.namePlaceholder}
          className="field"
        />
      </label>

      <label htmlFor={`${uid}-email`} className="grid gap-1.5 text-[0.75rem]">
        {copy.emailLabel}
        <input
          id={`${uid}-email`}
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder={copy.emailPlaceholder}
          className="field"
        />
      </label>

      <label htmlFor={`${uid}-type`} className="grid gap-1.5 text-[0.75rem]">
        {copy.enquiryTypeLabel}
        <select
          id={`${uid}-type`}
          name="enquiry-type"
          defaultValue={copy.enquiryTypes[0]}
          className="field"
        >
          {copy.enquiryTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>

      <label
        htmlFor={`${uid}-message`}
        className="grid gap-1.5 text-[0.75rem] sm:col-span-2"
      >
        {copy.messageLabel}
        <textarea
          id={`${uid}-message`}
          name="message"
          rows={3}
          required
          placeholder={copy.messagePlaceholder}
          className="field resize-y"
        />
      </label>

      <div className="sm:col-span-2">
        <Turnstile onToken={handleToken} />
      </div>

      {error && (
        <p role="alert" className="text-[0.75rem] text-[#e9b98f] sm:col-span-2">
          {error}
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="btn-light disabled:opacity-60"
        >
          {status === "submitting" ? copy.submittingLabel : copy.submitLabel}{" "}
          <span aria-hidden="true">↗</span>
        </button>
      </div>
      <p aria-live="polite" className="self-center text-[0.75rem] text-[#cbd1c6]">
        {copy.privacyNote}
      </p>
    </form>
  );
}
