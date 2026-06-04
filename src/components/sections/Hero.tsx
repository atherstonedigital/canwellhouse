import Container from "@/components/ui/Container";

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ paddingBlock: "var(--section-y)" }}
    >
      {/* Faint portal-frame mark as atmosphere */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/mark.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-[5%] top-[8%] h-[50vh] w-auto select-none opacity-[0.07]"
      />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-9">
            <p
              className="reveal-hero text-[length:var(--text-eyebrow)] font-medium uppercase tracking-[0.16em]"
              style={{ color: "var(--ink-muted)" }}
            >
              Group
            </p>

            <h1
              className="reveal-hero mt-6 font-display font-light leading-[1.04] tracking-[-0.015em]"
              style={{
                fontSize: "var(--text-display)",
                textWrap: "balance",
                animationDelay: "60ms",
              }}
            >
              One group of interiors brands, from £20 to £250,000.
            </h1>

            <p
              className="reveal-hero mt-8 leading-[1.55]"
              style={{
                fontSize: "var(--text-lead)",
                maxWidth: "var(--measure)",
                color: "var(--ink-muted)",
                animationDelay: "120ms",
              }}
            >
              Canwell House is the parent company of three interiors
              businesses: Xshowhome, Canwell Interiors and Saverys. Between
              them they serve the market from a £20 accessory to a £250,000
              commercial scheme.
            </p>

            <div
              className="reveal-hero mt-12 h-px w-full"
              style={{
                background: "var(--rule-brass)",
                animationDelay: "180ms",
              }}
            />
          </div>
        </div>
      </Container>

      {/* hero image: pending group photography */}
    </section>
  );
}
