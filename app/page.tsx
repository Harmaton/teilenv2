import CtaSection from "./components/landingpage/cta";
import WhatIsSection from "./components/landingpage/description";
import InnerMirrorSection from "./components/landingpage/differentiation";
import Footer from "./components/landingpage/footer";
import Hero from "./components/landingpage/hero";
import Navbar from "./components/landingpage/navbar";
import ScrollStory from "./components/landingpage/story";
import TestimonialsMarquee from "./components/landingpage/testimonials";


export default function Page() {
  return (
    <main className="min-h-screen bg-white ">
      <div className="mx-auto max-w-[1800px] overflow-hidden rounded-2xl border-t border-white/10">
        <div className="relative z-20">
          <Navbar />
        </div>
        <Hero />
        <ScrollStory />
        <WhatIsSection />
        <InnerMirrorSection />
        <TestimonialsMarquee />
        <CtaSection />
        <Footer />
      </div>
    </main>
  );
}