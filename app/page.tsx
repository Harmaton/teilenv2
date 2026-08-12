import CtaSection from "./components/landingpage/cta";
import WhatIsSection from "./components/landingpage/description";
import InnerMirrorSection from "./components/landingpage/differentiation";
import Footer from "./components/landingpage/footer";
import Hero from "./components/landingpage/hero";
import Navbar from "./components/landingpage/navbar";
import ScrollStory from "./components/landingpage/story";
import TestimonialsMarquee from "./components/landingpage/testimonials";
import { getAuthUser } from "@/lib/auth";

export default async function Page() {
  const authResult = await getAuthUser();
  const user = authResult.success ? authResult.user : null;

  return (
    <>
      <Navbar initialUser={user} />
      <main className="min-h-screen bg-white lg:px-12 md:px-6 sm:px-4">
        <div className="mx-auto py-6 overflow-hidden rounded-2xl border-t border-white/10">
          <Hero hasSession={!!user} />
          <ScrollStory />
          <WhatIsSection />
          <InnerMirrorSection />
          <TestimonialsMarquee />
          <CtaSection />
        </div>
        <Footer />
      </main>
    </>
  );
}
