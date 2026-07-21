import type { Metadata } from "next";
import EntryForm from "./EntryForm";

// Belt and braces alongside the edge function's X-Robots-Tag header.
export const metadata: Metadata = {
  title: "Manual entry",
  robots: { index: false, follow: false },
};

export default function ReportsEntryPage() {
  return <EntryForm />;
}
