import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/new-landing-page/legal-document-page";

export const metadata: Metadata = {
  title: "Precio: USD 50, pago único | Teilen Teens",
  description: "La evaluación inicial es gratis. El informe cuesta USD 50 o USD 20 con código de lanzamiento hasta el 31 de diciembre de 2026.",
};

export default function Page() {
  return <LegalDocumentPage filename="precio.html" activePage="/precio" includeLaunchOffer />;
}
