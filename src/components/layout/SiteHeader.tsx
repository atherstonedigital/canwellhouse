"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import { settings } from "@/lib/content";

export default function SiteHeader() {
  return (
    <header style={{ paddingBlock: "1.6rem" }}>
      <Container className="relative flex items-center justify-center">
        <Link href="/" aria-label="House of Canwell home">
          <Image
            src={settings.logo.src}
            alt={settings.logo.alt}
            width={settings.logo.width}
            height={settings.logo.height}
            priority
            className="h-16 w-auto sm:h-24"
          />
        </Link>
        <a
          href="#enquiries"
          className="absolute right-0 text-sm uppercase transition-colors duration-200"
          style={{
            letterSpacing: "0.14em",
            color: "var(--on-dark-muted)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-gold)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--on-dark-muted)")}
        >
          {settings.header.ctaLabel}
        </a>
      </Container>
    </header>
  );
}
