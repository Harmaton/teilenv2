import type { Metadata } from "next";
import VisionPage from "@/components/new-landing-page/vision-page";

export const metadata: Metadata = {
  title: "Nuestra visión: un perfil que cuente más que tus títulos | Teilen Teens",
  description: "Lo que existe hoy, lo que estamos desarrollando y lo que imaginamos construir: un perfil humano y profesional bajo tu control.",
};

export default function Page() {
  return <VisionPage />;
}
