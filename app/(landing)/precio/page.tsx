import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/new-landing-page/legal-document-page";

export const metadata: Metadata = {
  title: "Precio: USD 50, pago único | Teilen Teens",
  description: "Teilen Teens cuesta USD 50 en un pago único: informe de Identidad Evolutiva de 5 páginas en PDF y 5 preguntas a Salomón IA. La evaluación inicial es gratis.",
};

export default function Page() {
  return <LegalDocumentPage filename="precio.html" activePage="/precio" />;
}
