import type { Metadata } from "next";
import MethodologyPage from "@/components/new-landing-page/methodology-page";

export const metadata: Metadata = {
  title: "Método: la ciencia procesa, la IA traduce, tú decides | Teilen Teens",
  description: "Cómo funciona la evaluación de Teilen Teens: un motor metodológico calcula, una capa de IA traduce y Salomón IA ayuda a explorar el informe.",
};

export default function Page() {
  return <MethodologyPage />;
}
