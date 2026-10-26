import { Fragment } from "react";
import { lines } from "@/lib/content";

// Renders a copy field, turning each newline into a line break so editors can
// control where a heading wraps without touching markup.
export default function Lines({ text }: { text: string }) {
  const parts = lines(text);
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {part}
          {i < parts.length - 1 && <br />}
        </Fragment>
      ))}
    </>
  );
}
