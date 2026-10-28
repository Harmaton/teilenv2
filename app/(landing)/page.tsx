import type { Metadata } from "next";
import NewLandingPage from "@/components/new-landing-page";

export const metadata: Metadata = {
  title: "¿Para qué eres bueno? Descúbrelo en 5 minutos | Teilen Teens",
  description: "Explora tus talentos, cómo aprendes, tus valores y cuatro escenarios de futuro con Teilen Teens. Empieza sin tarjeta.",
};

export default function Page() {
  return <NewLandingPage />;
}
