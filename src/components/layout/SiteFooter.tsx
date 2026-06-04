import Image from "next/image";
import Container from "@/components/ui/Container";

export default function SiteFooter() {
  return (
    <footer className="mt-auto bg-ink" style={{ paddingBlock: "var(--section-y)" }}>
      <Container>
        <Image
          src="/brand/wordmark-reverse.svg"
          alt="Canwell House"
          width={180}
          height={30}
          className="h-5 w-auto opacity-80 sm:h-6"
        />
        <div
          className="mt-10 h-px w-full"
          style={{ background: "color-mix(in srgb, var(--color-stone) 15%, transparent)" }}
        />
        <div className="mt-8 space-y-2 text-sm" style={{ color: "color-mix(in srgb, var(--color-stone) 50%, transparent)" }}>
          <p>studio@canwellhouse.com</p>
          <p>&copy; 2026 Canwell House</p>
        </div>
      </Container>
    </footer>
  );
}
