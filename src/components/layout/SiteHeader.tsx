"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";

export default function SiteHeader() {
  return (
    <header style={{ paddingBlock: "1.6rem" }}>
      <Container className="flex items-center justify-between">
        <Link href="/" aria-label="Canwell House home">
          <Image
            src="/brand/Canwellhouse logo long white.png"
            alt="Canwell House"
            width={4128}
            height={1024}
            priority
            className="h-8 w-auto sm:h-10"
          />
        </Link>
        <a
          href="#enquiries"
          className="text-sm uppercase transition-colors duration-200"
          style={{
            letterSpacing: "0.14em",
            color: "var(--on-dark-muted)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-gold)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--on-dark-muted)")}
        >
          Enquiries
        </a>
      </Container>
    </header>
  );
}
