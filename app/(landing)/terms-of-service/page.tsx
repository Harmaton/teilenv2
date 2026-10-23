import type { Metadata } from "next";
import { TermsPage } from "@/components/new-landing-page/policy-page";

export const metadata: Metadata = {
  title: "Condiciones y compras | Teilen Teens",
  description: "Condiciones de compra de Teilen Teens: informe de Identidad Evolutiva por USD 50 con 5 preguntas a Salomón IA, pago, garantía y uso responsable.",
};

export default function Page() {
  return <TermsPage />;
}
