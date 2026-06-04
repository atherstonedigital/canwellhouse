import Image from "next/image";
import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="px-6 py-6 sm:px-10 sm:py-8">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
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
          className="font-body text-sm tracking-wide text-ink/70 transition-colors hover:text-ink"
        >
          Enquiries
        </a>
      </div>
    </header>
  );
}
