import Image from "next/image";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Lines from "@/components/ui/Lines";
import { brands as brandsContent, type Brand } from "@/lib/content";

const cardTint = ["bg-card", "bg-card-alt", "bg-card-alt", "bg-card"];

function LogoPanel({ brand }: { brand: Brand }) {
  const onPaper = brand.panel === "paper";
  return (
    <h3
      className={`mb-6 flex h-28 w-full items-center justify-center gap-4 px-5 py-3 text-[2.125rem] ${
        onPaper ? "bg-[#eee8dc]" : "bg-ink"
      } ${brand.caption ? "flex-col gap-1.5" : ""}`}
    >
      <Image
        src={brand.logo}
        alt={brand.logoText ? "" : brand.name}
        width={brand.logoWidth}
        height={brand.logoHeight}
        className={`block h-auto w-auto max-w-full object-contain ${brand.logoClass} ${
          onPaper ? "max-w-[42%]" : ""
        }`}
      />
      {brand.caption && (
        <small className="eyebrow text-[0.5625rem] text-paper">{brand.caption}</small>
      )}
      {brand.logoText && (
        <span className="font-display text-[1.125rem] leading-[1.3] tracking-[0.06em] text-[#344037] uppercase">
          <Lines text={brand.logoText} />
        </span>
      )}
    </h3>
  );
}

export default function Brands() {
  const { items } = brandsContent;
  const total = String(items.length).padStart(2, "0");

  return (
    <section id="brands" className="scroll-mt-6 pt-4 pb-12 sm:pb-16">
      <Container>
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <Eyebrow className="mb-3">{brandsContent.eyebrow}</Eyebrow>
            <h2 className="text-[length:var(--text-h2)]">
              <Lines text={brandsContent.heading} />
            </h2>
          </div>
          <span className="whitespace-nowrap text-[0.625rem] text-[#777d70]">
            01 — {total}
          </span>
        </div>

        <div className="grid gap-[18px] sm:grid-cols-2">
          {items.map((brand, i) => (
            <article
              key={brand.name}
              className={`flex min-h-[270px] flex-col items-start border border-line px-7 py-6 sm:min-h-[296px] ${
                cardTint[i % cardTint.length]
              }`}
            >
              <div className="mb-7 flex w-full justify-between gap-2.5 text-[0.5625rem] tracking-[0.17em] text-[#65715f] uppercase">
                <span>
                  {brand.index} / {brand.tier}
                </span>
                <span aria-hidden="true">↗</span>
              </div>

              <LogoPanel brand={brand} />

              <p className="mb-6 max-w-[340px] text-[0.8125rem] text-[#586154]">
                {brand.descriptor}
              </p>

              <a
                href={brand.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto flex w-full justify-between border-t border-[#c7ccbd] pt-3 text-[0.6875rem] hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                {brand.ctaLabel} <span aria-hidden="true">↗</span>
              </a>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
