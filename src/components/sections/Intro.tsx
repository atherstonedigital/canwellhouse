import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Lines from "@/components/ui/Lines";
import { home } from "@/lib/content";

export default function Intro() {
  const { intro } = home;

  return (
    <section className="py-10 sm:py-16">
      <Container className="grid items-center gap-x-16 gap-y-4 sm:grid-cols-[1.15fr_1fr]">
        <Eyebrow className="sm:col-span-2">{intro.eyebrow}</Eyebrow>
        <h2 className="text-[length:var(--text-h2)]">
          <Lines text={intro.heading} />
        </h2>
        <p className="max-w-[380px] text-[0.8125rem] text-muted">{intro.body}</p>
      </Container>
    </section>
  );
}
