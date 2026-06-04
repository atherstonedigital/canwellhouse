"use client";

import Link from "next/link";
import Container from "@/components/ui/Container";

export default function SiteHeader() {
  return (
    <header style={{ paddingBlock: "1.6rem" }}>
      <Container className="flex items-center justify-between">
        <Link
          href="/"
          aria-label="Canwell House home"
          className="font-display text-lg font-normal"
          style={{ letterSpacing: "0.22em", color: "var(--on-dark)" }}
        >
          CANWELL HOUSE
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
