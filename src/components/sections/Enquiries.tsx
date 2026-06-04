"use client";

import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/lib/useReveal";

export default function Enquiries() {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      id="enquiries"
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
            <h2
              className="font-display font-light tracking-tight"
              style={{ fontSize: "var(--text-h2)" }}
            >
              Enquiries
            </h2>

            <p
              className="mt-6 leading-[1.55]"
              style={{
                fontSize: "var(--text-lead)",
                maxWidth: "var(--measure)",
                color: "var(--ink-muted)",
              }}
            >
              Canwell House works with investors and partners seeking exposure
              to a diversified interiors group. For investment, partnership or
              press enquiries, contact the group directly.
            </p>

            <a
              href="mailto:studio@canwellhouse.com"
              className="enquiry-btn mt-10 inline-block border border-ink px-10 py-4 text-sm uppercase tracking-[0.12em] text-ink transition-[background-color,color] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass active:scale-[0.98]"
              style={{
                transitionDuration: "180ms",
                transitionTimingFunction: "var(--ease-out)",
              }}
            >
              Contact the group
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
