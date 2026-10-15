import type { Metadata } from "next";
import ReportsDashboard from "./ReportsDashboard";

// Belt and braces alongside the edge function's X-Robots-Tag header.
export const metadata: Metadata = {
  title: "Weekly reports",
  robots: { index: false, follow: false },
};

export default function ReportsPage() {
  return <ReportsDashboard />;
}
