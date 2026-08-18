
import Nav from "@/components/new/nav";
import Footer from "./components/landingpage/footer";
import { getAuthUser } from "@/lib/auth";
import Hero from "@/components/new/hero";
import StatsBar from "@/components/new/stats";
import PainSection from "@/components/new/pain-section";
import HowItWorks from "@/components/new/how-it works";
import VideoSection from "@/components/new/video-section";
import CompareSection from "@/components/new/compare-section";
// import Testimonials from "@/components/new/testimonials";

import StorySection from "@/components/new/stort-section";
import ParentsSection from "@/components/new/parent-section";
import TeamSection from "@/components/new/team-section";
import Testimonials from "./components/landingpage/testimonials";

export default async function Page() {
  const authResult = await getAuthUser();
  const user = authResult.success ? authResult.user : null;

  return (
    <>
      {/* <Navbar initialUser={user} /> */}
      <Nav initialUser={user} />
      <main className="min-h-screen bg-white">
        <div className="mx-auto py-6 overflow-hidden rounded-2xl border-t border-white/10">
        <Hero initialUser={user} />
        <StatsBar />
        <PainSection  />
        <HowItWorks />
        <VideoSection />
        <CompareSection />
        <Testimonials />
        <ParentsSection />
        <TeamSection />
        <StorySection   />
          {/* <Hero hasSession={!!user} />
          <ScrollStory />
          <WhatIsSection />
          <InnerMirrorSection />
          <TestimonialsMarquee />
          <CtaSection /> */}
        </div>
        <Footer />
      </main>
    </>
  );
}
