import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Lines from "@/components/ui/Lines";
import { home } from "@/lib/content";

export default function Places() {
  const { places } = home;

  return (
    <section id="places" className="scroll-mt-6 border-t border-[#ddded2] py-11">
      <Container>
        <Eyebrow className="mb-3">{places.eyebrow}</Eyebrow>
        <h2 className="text-[length:var(--text-h2)]">
          <Lines text={places.heading} />
        </h2>
        <div className="mt-6 grid gap-5 text-[0.75rem] text-[#62695c] sm:grid-cols-[1.2fr_1fr_1.2fr] sm:gap-9">
          <p>{places.body}</p>
          {places.locations.map((location) => (
            <p key={location.area}>
              <strong className="font-medium text-ink">{location.area}</strong>
              <br />
              <Lines text={location.brands} />
            </p>
          ))}
        </div>
      </Container>
    </section>
  );
}
