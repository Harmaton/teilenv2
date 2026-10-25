import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/new-landing-page/legal-document-page";

export const metadata: Metadata = {
  title: "Centro legal | Teilen Teens",
  description: "Precio, términos del servicio, política de privacidad y política de reembolso de Teilen Teens.",
};

export default function Page() {
  return (
    <LegalDocumentPage
      filename="index.html"
      activePage="/legal"
      includeDownloads
    />
  );
}
