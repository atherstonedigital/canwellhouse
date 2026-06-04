import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import Hero from "@/components/sections/Hero";
import Group from "@/components/sections/Group";
import Enquiries from "@/components/sections/Enquiries";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Group />
        <Enquiries />
      </main>
      <SiteFooter />
    </>
  );
}
