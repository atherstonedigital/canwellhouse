"use client";

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Eyebrow from "@/components/ui/Eyebrow";
import { useScrollReveal } from "@/lib/useReveal";
import { home } from "@/lib/content";

export default function Model() {
  const sectionRef = useScrollReveal<HTMLDivElement>();
  const { model } = home;

  return (
    <Section ground="petrol" id="model">
      <Container>
        <div ref={sectionRef} className="reveal-scroll">
          <Eyebrow>{model.eyebrow}</Eyebrow>

          <h2
            className="mt-6 font-light"
            style={{ fontSize: "var(--text-h2)", color: "var(--color-stone)" }}
          >
            {model.heading}
          </h2>

          <div
            className="mt-6 space-y-4 leading-[1.55]"
            style={{
              fontSize: "var(--text-lead)",
              maxWidth: "60ch",
              color: "var(--on-dark-muted)",
            }}
          >
            {model.paragraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
