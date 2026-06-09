const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://canwellhouse.com";

// Organization schema for the GROUP (Canwell House), with the three trading
// brands as subOrganization. Canwell House is the holding company and is NOT
// Canwell Interiors Ltd; this block models the group, never the operating
// company. Legal-entity naming is intentionally light pending sign-off.
const schema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Canwell House",
  url: SITE_URL,
  logo: `${SITE_URL}/icon-512.png`,
  description:
    "Canwell House is the parent company of Xshowhome, Canwell Interiors and Saverys, a group of interiors businesses spanning value to bespoke.",
  subOrganization: [
    {
      "@type": "Organization",
      name: "Xshowhome",
      url: "https://xshowhome.com/",
    },
    {
      "@type": "Organization",
      name: "Canwell Interiors",
      url: "https://canwellinteriors.com/",
    },
    {
      "@type": "Organization",
      name: "Saverys",
      url: "https://www.saverys.co.uk/",
    },
  ],
};

export default function OrganizationSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
