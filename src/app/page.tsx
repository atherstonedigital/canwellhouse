import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import Hero from "@/components/sections/Hero";
import Group from "@/components/sections/Group";
import Brands from "@/components/sections/Brands";
import Model from "@/components/sections/Model";
import Enquiries from "@/components/sections/Enquiries";
import GrainOverlay from "@/components/ui/GrainOverlay";

export default function Home() {
  return (
    <>
      <GrainOverlay />
      <SiteHeader />
      <main>
        <Hero />
        <Group />
        <Brands />
        <Model />
        <Enquiries />
      </main>
      <SiteFooter />
    </>
  );
}
