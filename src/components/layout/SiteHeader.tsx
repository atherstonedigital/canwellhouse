import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";

export default function SiteHeader() {
  return (
    <header
      className="relative"
      style={{ paddingBlock: "clamp(1.25rem, 2.5vw, 2rem)" }}
    >
      <Container className="flex items-center justify-between">
        <Link href="/" aria-label="Canwell House home">
          <Image
            src="/brand/lockup-horizontal.svg"
            alt="Canwell House"
            width={200}
            height={40}
            priority
            className="h-8 w-auto sm:h-10"
          />
        </Link>
        <a
          href="#enquiries"
          className="text-sm tracking-[0.12em] uppercase transition-colors duration-200"
          style={{ color: "var(--ink-muted)" }}
        >
          Enquiries
        </a>
      </Container>
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "var(--rule-brass)" }}
      />
    </header>
  );
}
