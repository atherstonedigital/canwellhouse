"use client";

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Eyebrow from "@/components/ui/Eyebrow";
import ContactForm from "@/components/ui/ContactForm";
import { useScrollReveal } from "@/lib/useReveal";

export default function Enquiries() {
  const sectionRef = useScrollReveal<HTMLDivElement>();

  return (
    <Section ground="petrol" id="enquiries">
      <Container>
        <div ref={sectionRef} className="reveal-scroll">
          <Eyebrow>ENQUIRIES</Eyebrow>

          <h2
            className="mt-6 font-light"
            style={{ fontSize: "var(--text-h2)", color: "var(--color-stone)" }}
          >
            Enquiries
          </h2>

          <p
            className="mt-6 leading-[1.55]"
            style={{
              fontSize: "var(--text-lead)",
              maxWidth: "var(--measure)",
              color: "var(--on-dark-muted)",
            }}
          >
            Canwell House works with investors and partners seeking exposure
            to a diversified interiors group. For investment, partnership or
            press enquiries, contact the group directly.
          </p>

          <ContactForm />

          <p
            className="mt-8 text-sm leading-[1.55]"
            style={{ color: "var(--on-dark-muted)" }}
          >
            Or email the group directly at{" "}
            <a
              href="mailto:studio@canwellhouse.com"
              className="underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ color: "var(--color-gold)", outlineColor: "var(--color-gold)" }}
            >
              studio@canwellhouse.com
            </a>
            .
          </p>
        </div>
      </Container>
    </Section>
  );
}
