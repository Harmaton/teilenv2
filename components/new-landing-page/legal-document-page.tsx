import { getLegalDocumentContent, type LegalDocument } from "@/lib/legal-documents";
import LandingNav from "./nav";
import LandingFooter, { WhatsAppFloat } from "./footer";

export async function LegalDocumentPage({
  filename,
  activePage,
  includeDownloads = false,
}: {
  filename: LegalDocument;
  activePage: string;
  includeDownloads?: boolean;
}) {
  const content = await getLegalDocumentContent(filename);

  return (
    <>
      <LandingNav activePage={activePage} />
      <main id="contenido">
        <div dangerouslySetInnerHTML={{ __html: content }} />
        {includeDownloads && (
          <section className="sec-s bg-white">
            <div className="wrap">
              <div className="callout violet">
                <span className="ic" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 3v12" />
                    <path d="m7 10 5 5 5-5" />
                    <path d="M5 20h14" />
                  </svg>
                </span>
                <div>
                  <p className="kicker">Para compartir con el equipo</p>
                  <h2>Descarga los documentos vigentes</h2>
                  <p>
                    El paquete incluye precio, términos del servicio, política
                    de privacidad y política de reembolso.
                  </p>
                  <div className="btn-row legal-download-actions">
                    <a
                      className="btn btn-primary"
                      href="/legal-documents/teilenteens-documentos-legales.pdf"
                      download
                    >
                      Descargar PDF
                    </a>
                    <a
                      className="btn btn-line"
                      href="/legal-documents/teilenteens-documentos-legales.docx"
                      download
                    >
                      Descargar DOCX editable
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      <LandingFooter />
      <WhatsAppFloat />
    </>
  );
}
