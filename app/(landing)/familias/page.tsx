import type { Metadata } from "next";
import FamiliesPage from "@/components/new-landing-page/families-page";

export const metadata: Metadata = {
  title: "Para familias: acompaña sin elegir por él | Teilen Teens",
  description:
    "Comprende las capacidades, la forma de aprender y los valores de tu hijo con un informe de Identidad Evolutiva. Autorización familiar para menores de 13 a 17 años.",
};

export default function Page() {
  return <FamiliesPage />;
}
