import type { Metadata } from "next";
import SchoolsPage from "@/components/new-landing-page/schools-page";

export const metadata: Metadata = {
  title: "Para colegios: orientar no es elegir por el estudiante | Teilen Teens",
  description:
    "Teilen Teens complementa la tutoría y la orientación educativa: experiencia individual, campaña institucional o curso piloto, sin rankings ni perfiles para clasificar alumnos.",
};

export default function Page() {
  return <SchoolsPage />;
}
