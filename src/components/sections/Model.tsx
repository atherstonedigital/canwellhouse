"use client";

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Eyebrow from "@/components/ui/Eyebrow";
import { useScrollReveal } from "@/lib/useReveal";

export default function Model() {
  const sectionRef = useScrollReveal<HTMLDivElement>();

  return (
    <Section ground="petrol" id="model">
      <Container>
        <div ref={sectionRef} className="reveal-scroll">
          <Eyebrow>THE MODEL</Eyebrow>

          <h2
            className="mt-6 font-light"
            style={{ fontSize: "var(--text-h2)", color: "var(--color-stone)" }}
          >
            Built to reinforce each other.
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
      </Container>
    </Section>
  );
}
