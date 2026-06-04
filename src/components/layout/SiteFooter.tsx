import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";

export default function SiteFooter() {
  return (
    <footer className="mt-auto">
      <Section ground="petrol-deep">
        <div
          className="absolute top-0 right-0 left-0 h-px"
          style={{ background: "color-mix(in srgb, var(--color-gold) 40%, transparent)" }}
        />
        <Container>
          <p
            className="font-display text-lg font-normal"
            style={{ letterSpacing: "0.22em", color: "var(--on-dark)" }}
          >
            CANWELL HOUSE
          </p>

          <p
            className="mt-3 text-sm"
            style={{ letterSpacing: "0.18em", color: "var(--color-gold)" }}
          >
            Interiors | Design | Retail
          </p>

          <div className="mt-10 space-y-2 text-sm" style={{ color: "var(--on-dark-muted)" }}>
            <p>Canwell House Ltd is the parent company of Xshowhome, Canwell Interiors and Saverys.</p>
            <p>studio@canwellhouse.com</p>
            <p>&copy; 2026 Canwell House</p>
          </div>
        </Container>
      </Section>
    </footer>
  );
}
