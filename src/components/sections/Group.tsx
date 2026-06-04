"use client";

import Image from "next/image";
import Container from "@/components/ui/Container";
import { useScrollReveal } from "@/lib/useReveal";

const brands = [
  {
    index: "01",
    name: "Xshowhome",
    logo: "/brand/xshowhome-horizontal.png",
    logoWidth: 4128,
    logoHeight: 1024,
    descriptor:
      "The growth engine. A direct-to-consumer furniture brand selling nationally online and through its Buzzard Valley showroom. Ex-showhome pieces and premium new stock at exceptional value, rated 4.9 out of 5 across more than 120 reviews.",
  },
  {
    index: "02",
    name: "Canwell Interiors",
    logo: "/brand/canwell-interiors-horizontal.png",
    logoWidth: 802,
    logoHeight: 131,
    descriptor:
      "The premium retail showroom. A curated whole-home furnishings showroom at the Cotswold Design Centre in Broadway, open seven days, with in-person design help and a considered, premium selection.",
  },
  {
    index: "03",
    name: "Saverys",
    logo: "/brand/saverys.png",
    logoWidth: 500,
    logoHeight: 250,
    descriptor:
      "The high end. A luxury interior design studio established in 1942, with studios in Broadway, Ludlow and Chelsea. In-house hand upholstery and bespoke furniture manufacture for private residences and luxury hotels.",
  },
];

export default function Group() {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      id="group"
      className="reveal-scroll relative"
      style={{ paddingBlock: "var(--section-y)" }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "var(--rule-brass)" }}
      />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p
              className="text-[length:var(--text-eyebrow)] font-medium uppercase tracking-[0.16em]"
              style={{ color: "var(--ink-muted)" }}
            >
              The group
            </p>

            <h2
              className="mt-6 font-display font-light tracking-tight"
              style={{ fontSize: "var(--text-h2)" }}
            >
              Three businesses, one structure.
            </h2>

            <div
              className="mt-6 space-y-4 leading-[1.55]"
              style={{
                fontSize: "var(--text-lead)",
                maxWidth: "var(--measure)",
                color: "var(--ink-muted)",
              }}
            >
              <p>
                Canwell House builds and owns interiors brands that reach
                different customers at different price points. Xshowhome sells
                nationally online and through its showroom at exceptional value.
                Canwell Interiors is the premium retail showroom, curated and in
                person. Saverys designs and makes at the high end, with its own
                upholstery and bespoke workshops.
              </p>
              <p>
                Each brand is strong on its own. Held together, they cover more
                of the market than any one of them could alone. The group owns
                its design and manufacturing capability and runs its own
                ecommerce and delivery, so margin and expertise stay in-house.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3">
          {brands.map((brand, i) => (
            <div
              key={brand.name}
              className="relative"
              style={{
                paddingBlock: "1.5rem",
              }}
            >
              {/* Vertical rule on desktop, horizontal on mobile */}
              {i > 0 && (
                <>
                  <div
                    className="absolute top-0 left-0 right-0 h-px sm:hidden"
                    style={{ background: "var(--rule-brass)" }}
                  />
                  <div
                    className="absolute top-0 bottom-0 left-0 hidden w-px sm:block"
                    style={{ background: "var(--rule-brass)" }}
                  />
                </>
              )}

              <div className={i > 0 ? "sm:pl-8" : ""}>
                <span
                  className="font-display text-sm"
                  style={{ color: "var(--ink-muted)" }}
                >
                  {brand.index}
                </span>
                <div className="mt-4 flex h-14 items-center">
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    width={brand.logoWidth}
                    height={brand.logoHeight}
                    className="h-auto max-h-full w-auto max-w-[180px] object-contain object-left"
                  />
                </div>
                <p
                  className="mt-4 text-base leading-relaxed"
                  style={{ color: "var(--ink-muted)" }}
                >
                  {brand.descriptor}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
