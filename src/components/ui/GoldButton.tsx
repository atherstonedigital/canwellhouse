export default function GoldButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="gold-btn inline-block border px-[1.8rem] py-[0.95rem] text-sm uppercase transition-[background-color,color] focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.98]"
      style={{
        letterSpacing: "0.16em",
        borderColor: "var(--color-gold)",
        color: "var(--color-gold)",
        transitionDuration: "220ms",
        transitionTimingFunction: "var(--ease-out)",
        outlineColor: "var(--color-gold)",
      }}
    >
      {children}
    </a>
  );
}
