"use client";

import Script from "next/script";
import { useSyncExternalStore } from "react";

// Production-only allowlist. These are production hosts, never previews or localhost.
// houseofcanwell.co.uk is the primary live domain; canwellhouse.com is kept so
// analytics keep firing if it is served directly rather than redirected.
const PROD_HOSTNAMES = [
  "houseofcanwell.co.uk",
  "www.houseofcanwell.co.uk",
  "canwellhouse.com",
  "www.canwellhouse.com",
];
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;

// The host is fixed for the page's lifetime, so there are no external updates.
const subscribe = () => () => {};
const getClientSnapshot = () =>
  Boolean(GA4_ID && PROD_HOSTNAMES.includes(window.location.hostname));
const getServerSnapshot = () => false;

export default function GA4() {
  // Server and first client paint render nothing (server snapshot is false);
  // after hydration the client snapshot enables GA only on a production host.
  // This keeps the mount-based gate without a hydration mismatch and without
  // calling setState inside an effect.
  const enabled = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  );

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
