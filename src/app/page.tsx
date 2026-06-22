import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import Hero from "@/components/sections/Hero";
import Group from "@/components/sections/Group";
import Brands from "@/components/sections/Brands";
import Model from "@/components/sections/Model";
import Enquiries from "@/components/sections/Enquiries";
import GrainOverlay from "@/components/ui/GrainOverlay";
import { home } from "@/lib/content";

export default function Home() {
  return (
    <>
      <GrainOverlay />
      <SiteHeader />
      <main>
        <Hero />
        {home.group.visible !== false && <Group />}
        <Brands />
        {home.model.visible !== false && <Model />}
        <Enquiries />
      </main>
      <SiteFooter />
    </>
  );
}
