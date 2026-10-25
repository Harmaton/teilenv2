import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/new-landing-page/legal-document-page";

export const metadata: Metadata = {
  title: "Política de privacidad | Teilen Teens",
  description: "Qué información recoge Teilen Teens, para qué la usa, quién puede acceder y cuáles son tus derechos.",
};

export default function Page() {
  return <LegalDocumentPage filename="privacidad.html" activePage="/privacidad" />;
}
