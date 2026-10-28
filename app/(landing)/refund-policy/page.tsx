import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/new-landing-page/legal-document-page";

export const metadata: Metadata = {
  title: "Política de reembolso | Teilen Teens",
  description: "Condiciones para solicitar un reembolso por compras digitales en Teilen Teens.",
};

export default function Page() {
  return <LegalDocumentPage filename="reembolsos.html" activePage="/reembolsos" />;
}
