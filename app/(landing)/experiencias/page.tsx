import type { Metadata } from "next";
import ExperiencesPage from "@/components/new-landing-page/experiences-page";

export const metadata: Metadata = {
  title: "Experiencias reales con Teilen Teens",
  description:
    "Testimonios de madres, padres, educadores y profesionales de 8 países, con nombre, rol y país. Percepciones personales, no validación científica.",
};

export default function Page() {
  return <ExperiencesPage />;
}
