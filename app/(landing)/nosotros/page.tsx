import type { Metadata } from "next";
import AboutPage from "@/components/new-landing-page/about-page";

export const metadata: Metadata = {
  title: "Nosotros: equipo e historia de Teilen Teens",
  description:
    "Conoce el origen de Teilen Teens, su propósito y el equipo interdisciplinario que lo desarrolla con la Fundación Simple Life.",
};

export default function Page() {
  return <AboutPage />;
}
