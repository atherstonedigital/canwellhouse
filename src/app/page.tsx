import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import Hero from "@/components/sections/Hero";
import Group from "@/components/sections/Group";
import Model from "@/components/sections/Model";
import Enquiries from "@/components/sections/Enquiries";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Group />
        <Model />
        <Enquiries />
      </main>
      <SiteFooter />
    </>
  );
}
