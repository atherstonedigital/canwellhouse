import Image from "next/image";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Rule from "@/components/ui/Rule";
import GoldButton from "@/components/ui/GoldButton";
import { home } from "@/lib/content";

export default function Hero() {
  const { hero } = home;

  return (
    <section className="relative min-h-[85vh] overflow-hidden">
      <Image
        src="/brand/canwellhouse heroimage .webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: "linear-gradient(to right, rgba(27,37,40,.88) 45%, rgba(27,37,40,.45) 100%)" }}
      />

      <Container className="relative z-10 flex min-h-[85vh] items-center">
        <div className="max-w-2xl" style={{ paddingBlock: "var(--section-y)" }}>
          <div className="reveal-hero">
            <Eyebrow>{hero.eyebrow}</Eyebrow>
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
            {hero.heading}
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
            {hero.body}
          </p>

          <div
            className="reveal-hero mt-10"
            style={{ animationDelay: "240ms" }}
          >
            <GoldButton href={hero.ctaHref}>{hero.ctaLabel}</GoldButton>
          </div>
        </div>
      </Container>
    </section>
  );
}
