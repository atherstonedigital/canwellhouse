const brands = [
  {
    name: "Canwell Interiors",
    descriptor: "The operating company at the centre of the group.",
  },
  {
    name: "Saverys",
    descriptor: "A design practice.",
  },
  {
    name: "Xshowhome",
    descriptor: "A retail brand.",
  },
];

export default function Group() {
  return (
    <section id="group" className="px-6 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-display text-3xl font-light tracking-tight sm:text-4xl">
          The group
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/75">
          Canwell House brings three established businesses under single
          ownership. Each keeps its own identity, customers and team. The group
          sets direction and standards across them.
        </p>
        <div className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-8">
          {brands.map((brand) => (
            <div key={brand.name}>
              <h3 className="font-display text-xl font-medium tracking-tight">
                {brand.name}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-ink/65">
                {brand.descriptor}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
