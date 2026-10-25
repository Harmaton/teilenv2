import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/new-landing-page/legal-document-page";

export const metadata: Metadata = {
  title: "Términos del servicio | Teilen Teens",
  description: "Términos del servicio de Teilen Teens, pagos, reembolsos y uso responsable de la plataforma.",
};

export default function Page() {
  return <LegalDocumentPage filename="terminos.html" activePage="/terminos" />;
}
