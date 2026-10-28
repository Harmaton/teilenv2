const launchCodeWhatsAppUrl =
  "https://wa.me/5493517623874?text=Hola%2C%20quiero%20mi%20c%C3%B3digo%20de%20lanzamiento%20de%20Teilen%20Teens.";

export default function LaunchOffer() {
  return (
    <aside className="launch-offer" aria-label="Oferta de lanzamiento">
      <span className="launch-offer-badge" aria-hidden="true">-60%</span>
      <div className="launch-offer-copy">
        <strong>Código de lanzamiento</strong>
        <p>Pagas USD 20 en lugar de USD 50, hasta el 31 de diciembre de 2026.</p>
      </div>
      <a
        className="btn btn-ink btn-sm"
        href={launchCodeWhatsAppUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        Quiero mi código
      </a>
    </aside>
  );
}
