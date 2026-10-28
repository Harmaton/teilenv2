import { getLegalDocumentContent, type LegalDocument } from "@/lib/legal-documents";
import LandingNav from "./nav";
import LandingFooter, { WhatsAppFloat } from "./footer";
import LaunchOffer from "./launch-offer";

export async function LegalDocumentPage({
  filename,
  activePage,
  includeDownloads = false,
  includeLaunchOffer = false,
  includeTermsSupplement = false,
}: {
  filename: LegalDocument;
  activePage: string;
  includeDownloads?: boolean;
  includeLaunchOffer?: boolean;
  includeTermsSupplement?: boolean;
}) {
  const content = await getLegalDocumentContent(filename);

  return (
    <>
      <LandingNav activePage={activePage} />
      <main id="contenido">
        {includeLaunchOffer && <div className="wrap launch-offer-wrap"><LaunchOffer /></div>}
        <div dangerouslySetInnerHTML={{ __html: content }} />
        {includeTermsSupplement && (
          <section className="sec bg-white">
            <div className="wrap">
              <div className="head">
                <h2>Programas y ofertas vigentes</h2>
                <p className="lead">Estas opciones son independientes y sus condiciones se muestran antes de confirmar una compra.</p>
              </div>
              <div className="isnot">
                <article className="tile">
                  <h3>Identidad Evolutiva completa</h3>
                  <p>La evaluación inicial es gratuita. El informe de 5 páginas en PDF y 5 preguntas a Salomón IA cuestan USD 50 en un pago único.</p>
                  <p>Con el código de lanzamiento, el precio es USD 20 hasta el 31 de diciembre de 2026.</p>
                  <a className="text-link" href="/precio">Ver precio y solicitar el código</a>
                </article>
                <article className="tile">
                  <h3>Werden</h3>
                  <p>Es un programa separado de entrenamiento de seis meses, con un precio de USD 520. Incluye la evaluación Teilen, la Identidad Evolutiva, 5 preguntas a Salomón IA, mentoría y las fases formativas.</p>
                  <p>Las fechas, los grupos y las condiciones de inscripción se informan antes de pagar.</p>
                </article>
              </div>
            </div>
          </section>
        )}
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
