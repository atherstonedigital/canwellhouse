"use client";

import Image from "next/image";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Eyebrow from "@/components/ui/Eyebrow";
import { useScrollReveal } from "@/lib/useReveal";
import { brands as brandsContent } from "@/lib/content";

export default function Brands() {
  const sectionRef = useScrollReveal<HTMLDivElement>();
  const { items: brands } = brandsContent;

  return (
    <Section ground="stone" id="brands">
      <Container>
        <div ref={sectionRef} className="reveal-scroll">
          <Eyebrow>{brandsContent.eyebrow}</Eyebrow>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3">
            {brands.map((brand, i) => (
              <div key={brand.name} className="relative" style={{ paddingBlock: "1.5rem" }}>
                {i > 0 && (
                  <>
                    <div
                      className="absolute top-0 right-0 left-0 h-px sm:hidden"
                      style={{ background: "rgba(37,51,54,.14)" }}
                    />
                    <div
                      className="absolute top-0 bottom-0 left-0 hidden w-px sm:block"
                      style={{ background: "rgba(37,51,54,.14)" }}
                    />
                  </>
                )}

                <a
                  href={brand.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${brand.name}`}
                  className={`group block transition-opacity duration-200 hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 ${
                    i > 0 ? "sm:pl-8" : ""
                  } ${i < brands.length - 1 ? "sm:pr-8" : ""}`}
                  style={{ outlineColor: "var(--color-gold)" }}
                >
                  <span
                    className="font-display text-lg"
                    style={{ color: "var(--color-gold)" }}
                  >
                    {brand.index}
                  </span>

                  <p
                    className="mt-3 text-xs font-medium uppercase"
                    style={{ letterSpacing: "0.18em", color: "var(--color-gold)" }}
                  >
                    {brand.tier}
                  </p>

                  <h3 className="mt-5 flex h-16 items-center sm:h-20">
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      width={brand.logoWidth}
                      height={brand.logoHeight}
                      className={`${brand.logoClass} w-auto object-contain object-left`}
                    />
                  </h3>

                  <p
                    className="mt-4 text-base leading-relaxed"
                    style={{ color: "var(--on-light-muted)" }}
                  >
                    {brand.descriptor}
                  </p>

                  <span
                    className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium uppercase"
                    style={{ letterSpacing: "0.16em", color: "var(--on-light)" }}
                  >
                    Visit site
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    >
                      &rarr;
                    </span>
                  </span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
