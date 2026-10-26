import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import Hero from "@/components/sections/Hero";
import Intro from "@/components/sections/Intro";
import Brands from "@/components/sections/Brands";
import Places from "@/components/sections/Places";
import Enquiries from "@/components/sections/Enquiries";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Intro />
        <Brands />
        <Places />
        <Enquiries />
      </main>
      <SiteFooter />
    </>
  );
}
