# Canwell House — Master Brief

Canwell House (`canwellhouse.com`) is the holding company above three trading brands: Canwell Interiors, Saverys and Xshowhome. This repo is the group's top-level site. It sells nothing; the trading brands carry all commercial and search weight.

## Purpose
Establish Canwell House as a credible parent that makes the group legible to investors and reassures customers the brands belong to one substantial business. Investor credibility leads; customer confidence is secondary.

## Two Canwells — keep distinct
Canwell House (the group) is NOT Canwell Interiors Ltd (the operating company behind Xshowhome). The word "Canwell" sits at both levels. Never let copy or markup conflate them.

## Voice
Corporate-premium-investor. Measured, declarative, understated confidence, third person about the group. UK English. No em dashes, no hype, no rule-of-three padding. NOT the Xshowhome customer voice; group copy is never signed "Gemma x". Sign-off sits with Gary.

## Stack
Next.js 15 (App Router) · Tailwind v4 · Decap CMS · Netlify · GitHub · GA4.

## Brand tokens (locked — from the redesigned logo)
- Petrol (primary dark ground): #253336
- Petrol deep (footer / depth): #1B2528
- Gold (accent only — hairlines, eyebrows, numerals, button edges): #C6974E
- Stone (light contrast ground + text on dark): #F4F1EC
- Display: Fraunces. Body/UI: Inter.
- Descriptor line: Interiors | Design | Retail

## Non-negotiables (fail silently in production if skipped)
- Validated schema types only; validate every block before shipping.
- GA4 hostname-gated to `canwellhouse.com` only; never fires on previews or localhost; strip any stray legacy tags.
- OG image as WebP and JPG (1200×630); reference the JPG for LinkedIn.
- Contact form verified end-to-end before launch: real submission reaches studio@canwellhouse.com; Turnstile proven to block a bot; success and failure paths both render.
- Decap Identity invite-only with Git Gateway; audit the user list before any handoff.
- Smoke tests pass before every deploy.

## Workflow
Branch (`feature/`, `fix/`, `cro/`, `brand/`) → PR → Netlify deploy preview → review → merge to `main` → production deploy. Gated phases: brand identity signed off before build; pre-launch triage cleared before go-live.

## Governance
Gary: commercial and brand sign-off, including go-live. Lyndsey Savery: Saverys input and assets. Dan (Atherstone): strategy, build, delivery.

## Build order (this site)
1. Bootstrap + landing page shell ← this prompt
2. SEO foundation (schema, meta, OG, sitemap, robots)
3. Decap CMS (invite-only, Git Gateway)
4. GA4 (hostname-gated to production)
5. Verified contact form (Turnstile, end-to-end)
Then pre-launch triage, then launch.
