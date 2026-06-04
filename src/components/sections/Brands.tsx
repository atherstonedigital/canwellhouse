"use client";

import Image from "next/image";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Eyebrow from "@/components/ui/Eyebrow";
import { useScrollReveal } from "@/lib/useReveal";

const brands = [
  {
    index: "01",
    tier: "RETAIL · ONLINE",
    name: "Xshowhome",
    logo: "/brand/xshowhome-horizontal.png",
    logoWidth: 4128,
    logoHeight: 1024,
    logoClass: "h-6 sm:h-7",
    descriptor:
      "A direct-to-consumer furniture brand selling nationally online and through its Buzzard Valley showroom. Ex-showhome pieces and premium new stock at exceptional value, rated 4.9 out of 5 across more than 120 reviews.",
  },
  {
    index: "02",
    tier: "PREMIUM RETAIL",
    name: "Canwell Interiors",
    logo: "/brand/canwell-interiors-horizontal.png",
    logoWidth: 802,
    logoHeight: 131,
    logoClass: "h-7 sm:h-8",
    descriptor:
      "A curated whole-home furnishings showroom at the Cotswold Design Centre in Broadway, open seven days, with in-person design help and a considered, premium selection.",
  },
  {
    index: "03",
    tier: "BESPOKE DESIGN",
    name: "Saverys",
    logo: "/brand/saverys.png",
    logoWidth: 500,
    logoHeight: 250,
    logoClass: "h-14 sm:h-16",
    descriptor:
      "A luxury interior design studio established in 1942, with studios in Broadway, Ludlow and Chelsea. In-house hand upholstery and bespoke furniture manufacture for private residences and luxury hotels.",
  },
];

export default function Brands() {
  const sectionRef = useScrollReveal<HTMLDivElement>();

  return (
    <Section ground="stone" id="brands">
      <Container>
        <div ref={sectionRef} className="reveal-scroll">
          <Eyebrow>THE BRANDS</Eyebrow>

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

                <div className={`${i > 0 ? "sm:pl-8" : ""} ${i < brands.length - 1 ? "sm:pr-8" : ""}`}>
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
