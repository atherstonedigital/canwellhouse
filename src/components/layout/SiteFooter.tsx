import Image from "next/image";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { settings } from "@/lib/content";

export default function SiteFooter() {
  const { footer, contactEmail } = settings;

  return (
    <footer className="mt-auto">
      <Section ground="petrol-deep">
        <div
          className="absolute top-0 right-0 left-0 h-px"
          style={{ background: "color-mix(in srgb, var(--color-gold) 40%, transparent)" }}
        />
        <Container>
          <Image
            src={settings.logo.src}
            alt={settings.logo.alt}
            width={settings.logo.width}
            height={settings.logo.height}
            className="h-6 w-auto opacity-80 sm:h-8"
          />

          <p
            className="mt-4 text-sm"
            style={{ letterSpacing: "0.18em", color: "var(--color-gold)" }}
          >
            {footer.descriptor}
          </p>

          <div className="mt-10 space-y-2 text-sm" style={{ color: "var(--on-dark-muted)" }}>
            <p>{footer.legal}</p>
            <p>{contactEmail}</p>
            <p>{footer.copyright}</p>
          </div>
        </Container>
      </Section>
    </footer>
  );
}
