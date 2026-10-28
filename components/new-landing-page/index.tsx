import LandingNav from "./nav";
import LandingHero from "./hero";
import HomeAudienceSection, { HomeAiSection, HomeAudiencePaths, HomeKineticSections } from "./home-audience-section";
import { StepsSection, ValuesSection, CtaSection } from "./steps-section";
import ReportExample from "./report-example";
import EcosystemSection from "./ecosystem-section";
import LandingFooter, { WhatsAppFloat } from "./footer";
import {
  HomeComparisonSection,
  HomeFaqSection,
  HomeHistorySection,
  HomeMentorSection,
  HomePriceSection,
  HomeTeamSection,
  HomeTestimonialsSection,
  HomeWerdenSection,
} from "./home-detail-sections";

export default function NewLandingPage() {
  return (
    <>
      <LandingNav />
      <main id="contenido">
        <LandingHero />
        <HomeKineticSections />
        <HomeAudienceSection />
        <HomeAudiencePaths />
        <StepsSection />
        <ReportExample />
        <ValuesSection />
        <HomeAiSection />
        <HomeMentorSection />
        <HomeComparisonSection />
        <HomePriceSection />
        <HomeHistorySection />
        <HomeTestimonialsSection />
        <HomeTeamSection />
        <HomeWerdenSection />
        <HomeFaqSection />
        <CtaSection />
        <EcosystemSection />
      </main>
      <LandingFooter />
      <WhatsAppFloat />
    </>
  );
}
