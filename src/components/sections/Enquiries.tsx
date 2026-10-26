"use client";

import { useId, useState } from "react";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Lines from "@/components/ui/Lines";
import ContactForm from "@/components/ui/ContactForm";
import { home, settings } from "@/lib/content";

export default function Enquiries() {
  const { enquiries } = home;
  const { contactEmail } = settings;
  const formId = useId();
  const [open, setOpen] = useState(false);

  return (
    <section
      id="enquiries"
      className="scroll-mt-6 bg-ink py-10 text-paper sm:py-12"
    >
      <Container className="flex flex-wrap items-center justify-between gap-8">
        <div>
          <Eyebrow className="mb-4 text-[#d3bf91]">{enquiries.eyebrow}</Eyebrow>
          <h2 className="text-[length:var(--text-h2-sm)]">
            <Lines text={enquiries.heading} />
          </h2>
          <p className="mt-5 text-[0.75rem] text-[#cbd1c6]">
            <Lines text={enquiries.body} />
          </p>
        </div>

        <button
          type="button"
          className="btn-light"
          aria-expanded={open}
          aria-controls={formId}
          onClick={() => setOpen((value) => !value)}
        >
          {enquiries.openLabel} <span aria-hidden="true">↗</span>
        </button>

        <div id={formId} hidden={!open} className="basis-full">
          <ContactForm autoFocus={open} />
          <p className="mt-6 text-[0.75rem] text-[#cbd1c6]">
            {enquiries.emailIntro}{" "}
            <a
              href={`mailto:${contactEmail}`}
              className="underline underline-offset-4 hover:text-accent-soft"
            >
              {contactEmail}
            </a>
            .
          </p>
        </div>
      </Container>
    </section>
  );
}
