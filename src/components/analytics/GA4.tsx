"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

// Production-only allowlist. These are production hosts, never previews or localhost.
// If the canonical host is the apex alone and www is unreachable, reduce to ["canwellhouse.com"].
const PROD_HOSTNAMES = ["canwellhouse.com", "www.canwellhouse.com"];
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;

export default function GA4() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (GA4_ID && PROD_HOSTNAMES.includes(window.location.hostname)) {
      setEnabled(true);
    }
  }, []);

  if (!enabled) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA4_ID}', {
            anonymize_ip: true,
            send_page_view: true
          });
        `}
      </Script>
    </>
  );
}
