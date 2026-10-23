import type { Metadata } from "next";
import YouthPage from "@/components/new-landing-page/youth-page";

export const metadata: Metadata = {
  title: "Para jóvenes: no eres una carrera, eres mucho más | Teilen Teens",
  description:
    "Descubre tus capacidades, cómo aprendes y qué problemas disfrutas resolver antes de decidir qué estudiar. Empieza sin pagar.",
};

export default function Page() {
  return <YouthPage />;
}
