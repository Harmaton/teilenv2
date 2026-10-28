import type { Metadata } from "next";
import MinorsPage from "@/components/new-landing-page/minors-page";

export const metadata: Metadata = {
  title: "Participación de menores | Teilen Teens",
  description: "Cómo participan jóvenes de 13 a 17 años en Teilen Teens: autorización verificable de una persona adulta responsable antes de la evaluación.",
};

export default function Page() {
  return <MinorsPage />;
}
