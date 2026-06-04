import Image from "next/image";

export default function SiteFooter() {
  return (
    <footer className="mt-auto bg-ink px-6 py-12 sm:px-10 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <Image
          src="/brand/wordmark-reverse.svg"
          alt="Canwell House"
          width={180}
          height={30}
          className="h-5 w-auto opacity-80 sm:h-6"
        />
        <div className="mt-8 space-y-1 text-sm text-stone/60">
          <p>
            Canwell House is the parent company of Canwell Interiors Ltd.
          </p>
          <p>studio@canwellhouse.com</p>
          <p>&copy; 2026 Canwell House</p>
        </div>
      </div>
    </footer>
  );
}
