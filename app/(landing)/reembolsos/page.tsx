import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/new-landing-page/legal-document-page";

export const metadata: Metadata = {
  title: "Política de reembolso: 14 días | Teilen Teens",
  description: "Política de reembolso de Teilen Teens: 14 días corridos para pedir el reembolso total por cualquier motivo.",
};

export default function Page() {
  return <LegalDocumentPage filename="reembolsos.html" activePage="/reembolsos" />;
}
