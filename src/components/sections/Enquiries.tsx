"use client";

import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Eyebrow from "@/components/ui/Eyebrow";
import GoldButton from "@/components/ui/GoldButton";
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

          <div className="mt-10">
            <GoldButton href="mailto:studio@canwellhouse.com">
              Contact the group
            </GoldButton>
          </div>
        </div>
      </Container>
    </Section>
  );
}
