import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import OrganizationSchema from "@/components/seo/OrganizationSchema";
import GA4 from "@/components/analytics/GA4";
import NetlifyIdentity from "@/components/cms/NetlifyIdentity";
import { settings } from "@/lib/content";

const fraunces = localFont({
  src: [
    {
      path: "../../brand/fonts/Fraunces_72pt-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../brand/fonts/Fraunces_72pt_Soft-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://canwellhouse.com"
  ),
  title: settings.seo.title,
  description: settings.seo.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "House of Canwell",
    title: settings.seo.title,
    description: settings.seo.description,
    url: "/",
    locale: "en_GB",
    images: [
      {
        // JPG referenced for LinkedIn, which does not reliably render WebP.
        url: "/og-canwellhouse-1200x630.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "House of Canwell",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: settings.seo.title,
    description: settings.seo.description,
    images: ["/og-canwellhouse-1200x630.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GB"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <OrganizationSchema />
        {children}
        <GA4 />
        <NetlifyIdentity />
      </body>
    </html>
  );
}
