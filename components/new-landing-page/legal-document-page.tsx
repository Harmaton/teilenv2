import { getLegalDocumentContent, type LegalDocument } from "@/lib/legal-documents";
import LandingNav from "./nav";
import LandingFooter, { WhatsAppFloat } from "./footer";

export async function LegalDocumentPage({
  filename,
  activePage,
}: {
  filename: LegalDocument;
  activePage: string;
}) {
  const content = await getLegalDocumentContent(filename);

  return (
    <>
      <LandingNav activePage={activePage} />
      <main id="contenido" dangerouslySetInnerHTML={{ __html: content }} />
      <LandingFooter />
      <WhatsAppFloat />
    </>
  );
}
