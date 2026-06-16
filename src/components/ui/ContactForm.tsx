"use client";

import { useCallback, useId, useState } from "react";
import Turnstile from "@/components/ui/Turnstile";
import { home } from "@/lib/content";

type Status = "idle" | "submitting" | "success" | "error";

const copy = home.enquiries.form;

const fieldStyle: React.CSSProperties = {
  background: "transparent",
  color: "var(--color-stone)",
  borderColor: "color-mix(in srgb, var(--color-stone) 28%, transparent)",
};

const labelStyle: React.CSSProperties = {
  letterSpacing: "0.16em",
  color: "var(--on-dark-muted)",
};

export default function ContactForm() {
  const uid = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [token, setToken] = useState("");

  const handleToken = useCallback((value: string) => setToken(value), []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const form = event.currentTarget;
    const fd = new FormData(form);

    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      organisation: String(fd.get("organisation") ?? ""),
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
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="mt-10 border p-8"
        style={{
          borderColor: "color-mix(in srgb, var(--color-gold) 50%, transparent)",
        }}
      >
        <p
          className="font-light"
          style={{ fontSize: "var(--text-h3)", color: "var(--color-stone)" }}
        >
          {copy.successHeading}
        </p>
        <p
          className="mt-3 leading-[1.55]"
          style={{ color: "var(--on-dark-muted)" }}
        >
          {copy.successBody}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 max-w-[34rem]" noValidate>
      {/* Honeypot: visually hidden, off the tab order. */}
      <div aria-hidden="true" className="hidden">
        <label>
          Do not fill this in
          <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-6">
        <Field
          id={`${uid}-name`}
          name="name"
          label={copy.nameLabel}
          autoComplete="name"
          required
        />
        <Field
          id={`${uid}-email`}
          name="email"
          label={copy.emailLabel}
          type="email"
          autoComplete="email"
          required
        />
        <Field
          id={`${uid}-organisation`}
          name="organisation"
          label={copy.organisationLabel}
          autoComplete="organization"
        />

        <div className="grid gap-2">
          <label
            htmlFor={`${uid}-type`}
            className="text-[length:var(--text-eyebrow)] font-medium uppercase"
            style={labelStyle}
          >
            {copy.enquiryTypeLabel}
          </label>
          <select
            id={`${uid}-type`}
            name="enquiry-type"
            defaultValue={copy.enquiryTypes[0]}
            className="border px-4 py-3 outline-none focus:border-[var(--color-gold)]"
            style={fieldStyle}
          >
            {copy.enquiryTypes.map((t) => (
              <option key={t} value={t} style={{ color: "#253336" }}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <label
            htmlFor={`${uid}-message`}
            className="text-[length:var(--text-eyebrow)] font-medium uppercase"
            style={labelStyle}
          >
            {copy.messageLabel}
          </label>
          <textarea
            id={`${uid}-message`}
            name="message"
            rows={5}
            required
            className="border px-4 py-3 outline-none focus:border-[var(--color-gold)] resize-y"
            style={fieldStyle}
          />
        </div>

        <Turnstile onToken={handleToken} />

        {error && (
          <p role="alert" className="text-sm" style={{ color: "#E0A57A" }}>
            {error}
          </p>
        )}

        <div>
          <button
            type="submit"
            disabled={status === "submitting"}
            className="gold-btn inline-block border px-[1.8rem] py-[0.95rem] text-sm uppercase transition-[background-color,color] focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.98] disabled:opacity-60 disabled:active:scale-100"
            style={{
              letterSpacing: "0.16em",
              borderColor: "var(--color-gold)",
              color: "var(--color-gold)",
              transitionDuration: "220ms",
              transitionTimingFunction: "var(--ease-out)",
              outlineColor: "var(--color-gold)",
            }}
          >
            {status === "submitting" ? copy.submittingLabel : copy.submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}

function Field({
  id,
  name,
  label,
  type = "text",
  autoComplete,
  required = false,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div className="grid gap-2">
      <label
        htmlFor={id}
        className="text-[length:var(--text-eyebrow)] font-medium uppercase"
        style={labelStyle}
      >
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        className="border px-4 py-3 outline-none focus:border-[var(--color-gold)]"
        style={fieldStyle}
      />
    </div>
  );
}
