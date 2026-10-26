import Image from "next/image";
import Eyebrow from "@/components/ui/Eyebrow";
import Lines from "@/components/ui/Lines";
import { home } from "@/lib/content";

// Accept a bare email address from the CMS and still render a working mailto link.
function normaliseHref(href: string) {
  return href.includes("@") && !/^(mailto:|https?:|tel:|#)/i.test(href)
    ? `mailto:${href}`
    : href;
}

export default function Hero() {
  const { hero } = home;

  return (
    <section
      id="home"
      className="relative flex min-h-[450px] items-center overflow-hidden bg-ink text-[#fff9ee] sm:min-h-[520px]"
    >
      <Image
        src={hero.image}
        alt={hero.imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(19,30,26,.87),rgba(19,30,26,.35)_68%,rgba(19,30,26,.12))]"
      />

      <div className="relative z-10 max-w-[760px] px-[var(--gutter)] pt-14 pb-28 sm:pt-20 sm:pb-28">
        <Eyebrow className="mb-5 text-accent-soft">{hero.eyebrow}</Eyebrow>
        <h1 className="mb-6 text-[length:var(--text-h1)] tracking-[-0.02em] text-balance">
          <Lines text={hero.heading} />
        </h1>
        <p className="max-w-[400px] text-[0.875rem] text-[#e3e1d7]">{hero.body}</p>
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <a href={normaliseHref(hero.primaryCtaHref)} className="btn-light">
            {hero.primaryCtaLabel} <span aria-hidden="true">↓</span>
          </a>
          <a href={normaliseHref(hero.secondaryCtaHref)} className="text-link">
            {hero.secondaryCtaLabel} <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      <div className="absolute right-[var(--gutter)] bottom-6 left-[var(--gutter)] z-10 border-t border-white/25 pt-4 font-display text-[0.875rem] italic">
        <span>{hero.tagline}</span>
      </div>
    </section>
  );
}
