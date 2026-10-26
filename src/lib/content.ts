// Typed content loader. Content is authored in /content/*.json via Decap CMS
// (see /public/admin) and committed to the repo; Netlify rebuilds on change.
// Importing the JSON statically keeps the site fully static with no runtime
// fetch, and gives every section a single validated source of truth.
import homeData from "../../content/home.json";
import brandsData from "../../content/brands.json";
import settingsData from "../../content/settings.json";

export type Hero = {
  eyebrow: string;
  heading: string;
  body: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  image: string;
  imageAlt: string;
  tagline: string;
};

export type Intro = {
  eyebrow: string;
  heading: string;
  body: string;
};

export type Location = {
  area: string;
  brands: string;
};

export type Places = {
  eyebrow: string;
  heading: string;
  body: string;
  locations: Location[];
};

export type ContactFormCopy = {
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  enquiryTypeLabel: string;
  enquiryTypes: string[];
  messageLabel: string;
  messagePlaceholder: string;
  submitLabel: string;
  submittingLabel: string;
  privacyNote: string;
  verificationError: string;
  successHeading: string;
  successBody: string;
};

export type Enquiries = {
  eyebrow: string;
  heading: string;
  body: string;
  openLabel: string;
  emailIntro: string;
  form: ContactFormCopy;
};

export type Home = {
  hero: Hero;
  intro: Intro;
  places: Places;
  enquiries: Enquiries;
};

export type Brand = {
  index: string;
  tier: string;
  name: string;
  url: string;
  logo: string;
  logoWidth: number;
  logoHeight: number;
  logoClass: string;
  // Ground behind the logo: dark ink for white logos, paper for dark artwork.
  panel?: "ink" | "paper";
  // Small line set under the logo, e.g. "Of Broadway and Ludlow".
  caption?: string;
  // Name set in type beside an emblem that carries no wordmark.
  logoText?: string;
  descriptor: string;
  ctaLabel: string;
};

export type Brands = {
  eyebrow: string;
  heading: string;
  items: Brand[];
};

export type Settings = {
  contactEmail: string;
  logo: { src: string; alt: string; width: number; height: number };
  header: { brandsLabel: string; placesLabel: string; ctaLabel: string };
  footer: { descriptor: string; legal: string; copyright: string };
  seo: { title: string; description: string };
};

export const home: Home = homeData;
export const brands: Brands = brandsData as Brands;
export const settings: Settings = settingsData;

// Copy fields may carry a literal newline where the design breaks a line.
export function lines(text: string): string[] {
  return text.split("\n");
}
