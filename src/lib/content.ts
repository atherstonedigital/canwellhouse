// Typed content loader. Content is authored in /content/*.json via Decap CMS
// (see /public/admin) and committed to the repo; Netlify rebuilds on change.
// Importing the JSON statically keeps the site fully static with no runtime
// fetch, and gives every section a single validated source of truth.
import homeData from "../../content/home.json";
import brandsData from "../../content/brands.json";
import settingsData from "../../content/settings.json";

export type CopyBlock = {
  visible?: boolean;
  eyebrow: string;
  heading: string;
  paragraphs: string[];
};

export type Hero = {
  eyebrow: string;
  heading: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
};

export type ContactFormCopy = {
  nameLabel: string;
  emailLabel: string;
  organisationLabel: string;
  enquiryTypeLabel: string;
  enquiryTypes: string[];
  messageLabel: string;
  submitLabel: string;
  submittingLabel: string;
  verificationError: string;
  successHeading: string;
  successBody: string;
};

export type Enquiries = {
  eyebrow: string;
  heading: string;
  body: string;
  emailIntro: string;
  form: ContactFormCopy;
};

export type Home = {
  hero: Hero;
  group: CopyBlock;
  model: CopyBlock;
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
  descriptor: string;
};

export type Brands = {
  eyebrow: string;
  items: Brand[];
};

export type Settings = {
  contactEmail: string;
  logo: { src: string; alt: string; width: number; height: number };
  header: { ctaLabel: string };
  footer: { descriptor: string; legal: string; copyright: string };
  seo: { title: string; description: string };
};

export const home: Home = homeData;
export const brands: Brands = brandsData;
export const settings: Settings = settingsData;
