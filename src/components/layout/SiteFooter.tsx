import Image from "next/image";
import Link from "next/link";
import { settings } from "@/lib/content";

export default function SiteFooter() {
  const { footer, logo, contactEmail } = settings;

  return (
    <footer className="mt-auto border-t border-[#5c685d] bg-ink text-[#d9dfd2]">
      <div className="mx-auto max-w-[1400px] px-[var(--gutter)] py-8">
        <div className="flex flex-wrap items-center justify-between gap-5 text-[0.625rem] tracking-[0.08em]">
          <Link href="/" aria-label="House of Canwell home" className="shrink-0">
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              className="block h-auto w-[190px]"
            />
          </Link>
          <span className="hidden sm:inline">{footer.descriptor}</span>
          <span>{footer.copyright}</span>
        </div>
        <div className="mt-6 max-w-[70ch] text-[0.6875rem] leading-relaxed text-[#a4ad9f]">
          <p>{footer.legal}</p>
          <p className="mt-1">
            <a href={`mailto:${contactEmail}`} className="hover:text-accent-soft">
              {contactEmail}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
