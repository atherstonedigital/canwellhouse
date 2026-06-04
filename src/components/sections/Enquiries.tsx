export default function Enquiries() {
  return (
    <section id="enquiries" className="px-6 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-display text-3xl font-light tracking-tight sm:text-4xl">
          Enquiries
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/75">
          For investment, partnership or press enquiries, contact the group
          directly.
        </p>
        <a
          href="mailto:studio@canwellhouse.com"
          className="mt-8 inline-block border border-ink/20 px-8 py-3 text-sm tracking-wide text-ink transition-colors hover:border-ink/40 hover:bg-ink/5"
        >
          Contact the group
        </a>
      </div>
    </section>
  );
}
