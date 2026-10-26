import Image from "next/image";
import Link from "next/link";
import { settings } from "@/lib/content";

export default function SiteHeader() {
  const { header, logo } = settings;

  return (
    <header className="bg-ink text-paper">
      <div className="mx-auto flex max-w-[1400px] items-start justify-between gap-6 px-[5%] py-6 sm:items-center sm:py-7">
        <Link href="/" aria-label="House of Canwell home" className="shrink-0">
          <Image
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            priority
            className="block h-auto w-[190px] sm:w-[230px]"
          />
        </Link>
        <nav
          aria-label="Main navigation"
          className="flex flex-col items-end gap-2 text-[0.75rem] sm:flex-row sm:items-center sm:gap-7"
        >
          <a href="#brands" className="hidden hover:text-accent-soft sm:inline">
            {header.brandsLabel}
          </a>
          <a href="#places" className="hidden hover:text-accent-soft sm:inline">
            {header.placesLabel}
          </a>
          <a
            href="#enquiries"
            className="border-b border-accent py-2.5 hover:text-accent-soft"
          >
            {header.ctaLabel} <span className="ml-3" aria-hidden="true">↗</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
