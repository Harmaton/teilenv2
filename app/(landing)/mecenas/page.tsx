import type { Metadata } from "next";
import MecenasPage from "@/components/new-landing-page/mecenas-page";

export const metadata: Metadata = {
  title: "Mecenas Teilen: financia el acceso de otros jóvenes",
  description: "Empresas y benefactores que financian participaciones en Werden para estudiantes de instituciones públicas, con reportes agregados que protegen a cada adolescente.",
};

export default function Page() {
  return <MecenasPage />;
}
