export default function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[length:var(--text-eyebrow)] font-medium uppercase"
      style={{ letterSpacing: "0.24em", color: "var(--color-gold)" }}
    >
      {children}
    </p>
  );
}
