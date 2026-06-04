import Image from "next/image";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Eyebrow from "@/components/ui/Eyebrow";
import Rule from "@/components/ui/Rule";
import GoldButton from "@/components/ui/GoldButton";

export default function Hero() {
  return (
    <Section ground="petrol">
      <Container>
        <div
          className="grid grid-cols-1 items-center lg:grid-cols-[1.15fr_0.85fr]"
          style={{ gap: "clamp(2.5rem, 5vw, 5rem)" }}
        >
          <div>
            <div className="reveal-hero">
              <Eyebrow>GROUP</Eyebrow>
            </div>

            <h1
              className="reveal-hero mt-6 font-light"
              style={{
                fontSize: "var(--text-display)",
                color: "var(--color-stone)",
                textWrap: "balance",
                animationDelay: "60ms",
              }}
            >
              From a single piece to a finished space.
            </h1>

            <div
              className="reveal-hero mt-10"
              style={{ animationDelay: "120ms" }}
            >
              <Rule />
            </div>

            <p
              className="reveal-hero mt-8 leading-[1.55]"
              style={{
                fontSize: "var(--text-lead)",
                maxWidth: "var(--measure)",
                color: "var(--on-dark-muted)",
                animationDelay: "180ms",
              }}
            >
              Canwell House is the parent company of three interiors
              businesses: Xshowhome, Canwell Interiors and Saverys. Between
              them they serve the market from a £20 accessory to a £250,000
              commercial scheme.
            </p>

            <div
              className="reveal-hero mt-10"
              style={{ animationDelay: "240ms" }}
            >
              <GoldButton href="mailto:studio@canwellhouse.com">
                Contact the group
              </GoldButton>
            </div>
          </div>

          <div className="reveal-hero" style={{ animationDelay: "120ms" }}>
            <div
              className="relative aspect-[16/10] w-full overflow-hidden lg:aspect-[4/3]"
              style={{
                border: "1px solid color-mix(in srgb, var(--color-gold) 35%, transparent)",
              }}
            >
              <Image
                src="/brand/canwellhouse heroimage .webp"
                alt="A furnished interior by the Canwell House group"
                fill
                priority
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
