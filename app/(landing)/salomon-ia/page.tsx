import type { Metadata } from "next";
import SalomonPage from "@/components/new-landing-page/salomon-page";

export const metadata: Metadata = {
  title: "Salomón IA: conversa con tu informe | Teilen Teens",
  description:
    "Salomón IA te ayuda a entender tu Identidad Evolutiva, comparar escenarios y diseñar experimentos. Cinco preguntas incluidas al desbloquear el informe.",
};

export default function Page() {
  return <SalomonPage />;
}
