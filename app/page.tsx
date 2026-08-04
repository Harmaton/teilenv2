import Hero from "./components/landingpage/hero";
import Navbar from "./components/landingpage/navbar";
import ScrollStory from "./components/landingpage/story";


export default function Page() {
  return (
    <main className="min-h-screen bg-black p-3 md:p-6">
      <div className="mx-auto max-w-[1400px] overflow-hidden rounded-2xl border-t border-white/10">
        <div className="relative z-20">
          <Navbar />
        </div>
        <Hero />
        <ScrollStory />
      </div>
    </main>
  );
}