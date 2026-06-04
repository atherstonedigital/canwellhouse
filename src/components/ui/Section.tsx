import { type ReactNode } from "react";

const grounds = {
  petrol: { background: "var(--color-petrol)", color: "var(--on-dark)" },
  "petrol-deep": { background: "var(--color-petrol-deep)", color: "var(--on-dark)" },
  stone: { background: "var(--color-stone)", color: "var(--on-light)" },
} as const;

export default function Section({
  ground,
  id,
  className = "",
  children,
}: {
  ground: keyof typeof grounds;
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={`relative ${className}`}
      style={{ ...grounds[ground], paddingBlock: "var(--section-y)" }}
    >
      {children}
    </section>
  );
}
