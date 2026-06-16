"use client";

import Script from "next/script";

// Loads the Netlify Identity widget used by Decap CMS (Git Gateway, invite-only).
// When an invited user opens their invite link they land on the site root with
// a #invite_token; the widget catches it, and on login we send them to /admin.
// The widget is dormant for ordinary visitors and adds no UI to the page.
export default function NetlifyIdentity() {
  return (
    <Script
      src="https://identity.netlify.com/v1/netlify-identity-widget.js"
      strategy="afterInteractive"
      onLoad={() => {
        const identity = (
          window as unknown as {
            netlifyIdentity?: {
              on: (event: string, cb: (user?: unknown) => void) => void;
            };
          }
        ).netlifyIdentity;
        if (!identity) return;
        identity.on("init", (user) => {
          if (!user) {
            identity.on("login", () => {
              document.location.href = "/admin/";
            });
          }
        });
      }}
    />
  );
}
