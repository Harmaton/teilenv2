import { FileText } from "lucide-react";
import Link from "next/link";

export default function LandingHero() {
  return (
    <section className="phero bg-ink dots">
      <div className="wrap">
        <div className="phero-grid">
          <div>
            <span className="sticker crumb">El producto al detalle</span>
            <h1>Primero te conoces. Después eliges qué hacer con esa información.</h1>
            <p className="lead">
              Teilen Teens convierte una evaluación breve en un informe de Identidad Evolutiva. No te entrega una profesión predeterminada: organiza información sobre cómo funcionas hoy y en qué escenarios podrías aportar valor.
            </p>
            <div className="btn-row">
              <Link className="btn btn-primary" href="/tests">
                <span>Empieza sin pagar</span><span className="ico"><ArrowIcon /></span>
              </Link>
              <a className="btn btn-line" href="#ejemplo">Ver un informe de ejemplo</a>
            </div>
          </div>
          <div className="phero-visual" aria-label="Vista previa del informe ficticio">
            <div className="phero-paper">
              <img src="/assets/reporte-0.webp" alt="Portada del informe de ejemplo de Identidad Evolutiva" width="708" height="1000" fetchPriority="high" />
              <span className="sticker">Ejemplo ficticio</span>
              <span className="pill"><FileText aria-hidden="true" /> 5 páginas</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7" /><path d="M8 7h9v9" /></svg>;
}
