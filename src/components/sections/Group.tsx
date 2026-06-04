"use client";

import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/lib/useReveal";

const brands = [
  {
    index: "01",
    name: "Canwell Interiors",
    descriptor: "The operating company at the centre of the group.",
  },
  {
    index: "02",
    name: "Saverys",
    descriptor: "A design practice.",
  },
  {
    index: "03",
    name: "Xshowhome",
    descriptor: "A retail brand.",
  },
];

export default function Group() {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      id="group"
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
              The group
            </p>

            <h2
              className="mt-6 font-display font-light tracking-tight"
              style={{ fontSize: "var(--text-h2)" }}
            >
              The group
            </h2>

            <p
              className="mt-6 leading-[1.55]"
              style={{
                fontSize: "var(--text-lead)",
                maxWidth: "var(--measure)",
                color: "var(--ink-muted)",
              }}
            >
              Canwell House brings three established businesses under single
              ownership. Each keeps its own identity, customers and team. The
              group sets direction and standards across them.
            </p>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3">
          {brands.map((brand, i) => (
            <div
              key={brand.name}
              className="relative"
              style={{
                paddingBlock: "1.5rem",
              }}
            >
              {/* Vertical rule on desktop, horizontal on mobile */}
              {i > 0 && (
                <>
                  <div
                    className="absolute top-0 left-0 right-0 h-px sm:hidden"
                    style={{ background: "var(--rule-brass)" }}
                  />
                  <div
                    className="absolute top-0 bottom-0 left-0 hidden w-px sm:block"
                    style={{ background: "var(--rule-brass)" }}
                  />
                </>
              )}

              <div className={i > 0 ? "sm:pl-8" : ""}>
                <span
                  className="font-display text-sm"
                  style={{ color: "var(--ink-muted)" }}
                >
                  {brand.index}
                </span>
                <h3
                  className="mt-2 font-display font-medium tracking-tight"
                  style={{ fontSize: "var(--text-h3)" }}
                >
                  {brand.name}
                </h3>
                <p
                  className="mt-2 text-base leading-relaxed"
                  style={{ color: "var(--ink-muted)" }}
                >
                  {brand.descriptor}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
