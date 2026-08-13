import { HeroSection } from "@/components/hero/HeroSection";
import { ContactPreview } from "@/components/sections/ContactPreview";
import { ProfileSection } from "@/components/sections/ProfileSection";
import { ProjectRegister } from "@/components/sections/ProjectRegister";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { BrandIntro } from "@/components/shell/BrandIntro";
import { PageInstruments } from "@/components/shell/PageInstruments";
import { SiteFooter } from "@/components/shell/SiteFooter";

export default function HomePage() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <BrandIntro />
      <PageInstruments />
      <main id="main-content">
        <HeroSection />
        <SkillsSection />
        <ProfileSection />
        <ProjectRegister />
        <ContactPreview />
      </main>
      <SiteFooter />
    </>
  );
}
