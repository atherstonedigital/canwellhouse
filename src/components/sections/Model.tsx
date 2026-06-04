"use client";

import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/lib/useReveal";

export default function Model() {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      id="model"
      className="reveal-scroll relative"
      style={{ paddingBlock: "var(--section-y)" }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "var(--rule-brass)" }}
      />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p
              className="text-[length:var(--text-eyebrow)] font-medium uppercase tracking-[0.16em]"
              style={{ color: "var(--ink-muted)" }}
            >
              The model
            </p>

            <h2
              className="mt-6 font-display font-light tracking-tight"
              style={{ fontSize: "var(--text-h2)" }}
            >
              Built to reinforce each other.
            </h2>

            <div
              className="mt-6 space-y-4 leading-[1.55]"
              style={{
                fontSize: "var(--text-lead)",
                maxWidth: "var(--measure)",
                color: "var(--ink-muted)",
              }}
            >
              <p>
                The brands share more than an owner. Xshowhome and Canwell
                Interiors route bespoke and full design work to Saverys. The
                retail brands and the online brand buy from the same suppliers,
                and Saverys&rsquo; workshops can manufacture for any of them.
              </p>
              <p>
                The result is a single group that captures demand across price
                points and channels, and keeps a customer inside it as their
                needs grow. Someone who starts with a £40 cushion online can
                later commission a room from the studio that makes it.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
