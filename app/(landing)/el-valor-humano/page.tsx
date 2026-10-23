import type { Metadata } from "next";
import HumanValuesPage from "@/components/new-landing-page/human-values-page";

export const metadata: Metadata = {
  title: "El Valor Humano: newsletter de Salomón Boss | Teilen Teens",
  description: "Reflexiones sobre identidad, talento, educación y trabajo. Suscríbete al newsletter El Valor Humano en LinkedIn.",
};

export default function Page() {
  return <HumanValuesPage />;
}
