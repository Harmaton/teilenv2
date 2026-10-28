import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/new-landing-page/legal-document-page";

export const metadata: Metadata = {
  title: "Términos del servicio | Teilen Teens",
  description: "Términos de Teilen Teens, informe por USD 50 o USD 20 con código de lanzamiento y programa Werden por USD 520.",
};

export default function Page() {
  return <LegalDocumentPage filename="terminos.html" activePage="/terminos" includeTermsSupplement />;
}
