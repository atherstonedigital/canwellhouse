"use client";

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Eyebrow from "@/components/ui/Eyebrow";
import { useScrollReveal } from "@/lib/useReveal";

export default function Group() {
  const sectionRef = useScrollReveal<HTMLDivElement>();

  return (
    <Section ground="petrol" id="group">
      <Container>
        <div ref={sectionRef} className="reveal-scroll">
          <Eyebrow>THE GROUP</Eyebrow>

          <h2
            className="mt-6 font-light"
            style={{ fontSize: "var(--text-h2)", color: "var(--color-stone)" }}
          >
            Three businesses, one structure.
          </h2>

          <div
            className="mt-6 space-y-4 leading-[1.55]"
            style={{
              fontSize: "var(--text-lead)",
              maxWidth: "60ch",
              color: "var(--on-dark-muted)",
            }}
          >
            <p>
              Canwell House builds and owns interiors brands that reach
              different customers at different price points. Xshowhome sells
              nationally online and through its showroom at exceptional value.
              Canwell Interiors is the premium retail showroom, curated and in
              person. Saverys designs and makes at the high end, with its own
              upholstery and bespoke workshops.
            </p>
            <p>
              Each brand is strong on its own. Held together, they cover more
              of the market than any one of them could alone. The group owns
              its design and manufacturing capability and runs its own
              ecommerce and delivery, so margin and expertise stay in-house.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
