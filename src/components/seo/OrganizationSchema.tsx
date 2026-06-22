import { brands, settings } from "@/lib/content";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://houseofcanwell.co.uk";

// Organization schema for the GROUP (House of Canwell), with the three trading
// brands as subOrganization. House of Canwell is the holding company and is NOT
// Canwell Interiors Ltd; this block models the group, never the operating
// company. alternateName keeps the prior display name ("Canwell House") for
// continuity with the canwellhouse.com domain. The group name is held constant
// to avoid conflating the two Canwells; the description and subOrganizations are
// derived from CMS content so the schema, the page and the brand list never
// drift apart.
const schema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "House of Canwell",
  alternateName: "Canwell House",
  legalName: "House of Canwell Limited",
  url: SITE_URL,
  logo: `${SITE_URL}/icon-512.png`,
  description: settings.seo.description,
  subOrganization: brands.items.map((brand) => ({
    "@type": "Organization",
    name: brand.name,
    url: brand.url,
  })),
};

export default function OrganizationSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
