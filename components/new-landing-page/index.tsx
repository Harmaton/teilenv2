import LandingNav from "./nav";
import LandingHero from "./hero";
import { StepsSection, PriceSection, ValuesSection, CtaSection } from "./steps-section";
import ReportExample from "./report-example";
import EcosystemSection from "./ecosystem-section";
import LandingFooter, { WhatsAppFloat } from "./footer";

export default function NewLandingPage() {
  return (
    <>
      <LandingNav />
      <main id="contenido">
        <LandingHero />
        <StepsSection />
        <ReportExample />
        <PriceSection />
        <ValuesSection />
        <CtaSection />
        <EcosystemSection />
      </main>
      <LandingFooter />
      <WhatsAppFloat />
    </>
  );
}
