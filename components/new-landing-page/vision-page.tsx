import Link from "next/link";
import { Info } from "lucide-react";
import LandingNav from "./nav";
import Reveal from "./reveal";
import EcosystemSection from "./ecosystem-section";
import LandingFooter, { WhatsAppFloat } from "./footer";

const horizons = [
  { badge: "Disponible hoy", title: "Identidad Evolutiva", description: "Evaluación breve, motor técnico, informe de cinco páginas y cinco preguntas con Salomón IA para seguir explorando. Un punto de partida para mirar el desarrollo humano de forma más estructurada." },
  { badge: "En desarrollo", title: "Entrenamiento y seguimiento", description: "Werden, el programa de seis meses, aporta cinco proyectos en mundos reales, trabajo en equipos cambiantes y un manifiesto personal. La mentoría humana acompaña a todos. Otras ampliaciones se sumarán cuando existan, con sus condiciones explicadas y los controles correspondientes." },
  { badge: "Visión a largo plazo", title: "Perfil humano y profesional progresivo", description: "Que tu identidad no dependa solo de un currículum declarativo: aprendizaje, habilidades observables y experiencias que quieras sumar a tu perfil, siempre bajo tu control y con tu consentimiento." },
];

export default function VisionPage() {
  return (
    <>
      <LandingNav activePage="/vision" />
      <main id="contenido">
        <section className="phero bg-violet dots"><div className="wrap"><Reveal>
          <span className="sticker crumb">La visión de Teilen</span>
          <h1>Tu perfil profesional debería contar más que tus títulos.</h1>
          <p className="lead" style={{ marginTop: "1.4rem" }}>Hoy buena parte del mundo laboral se construye desde lo que una persona declara haber estudiado o hecho. Queremos contribuir a una forma más amplia de reconocer el valor humano: capacidades, aprendizaje, criterio, experiencias y aportes demostrables.</p>
          <div className="btn-row" style={{ marginTop: "1.8rem" }}><Link className="btn btn-primary" href="/tests"><span>Empieza sin pagar</span><span className="ico"><ArrowIcon /></span></Link><Link className="btn btn-line" href="/#ejemplo">Ver un informe de ejemplo</Link></div>
        </Reveal></div></section>
        <section className="sec bg-paper"><div className="wrap"><Reveal className="split top">
          <div className="stack-lg sticky"><h2>Un perfil que evoluciona contigo.</h2><p className="lead">Primero conocemos cómo funcionas. Después puedes entrenar, contrastar y, con tu consentimiento, sumar nuevas evidencias de desarrollo a lo largo del tiempo.</p><span className="pill-note"><Info aria-hidden="true" />Visión en construcción, no una función disponible hoy</span></div>
          <div className="horizons" style={{ gridTemplateColumns: "1fr", marginTop: 0 }}>{horizons.map((item) => <Reveal key={item.title}><article className="horizon"><span className="badge">{item.badge}</span><h3>{item.title}</h3><p>{item.description}</p></article></Reveal>)}</div>
        </Reveal></div></section>
        <section className="sec bg-ink dots"><div className="wrap"><Reveal className="split">
          <div className="stack-lg"><h2>Una conversación que ya empezó más allá de Teilen.</h2><p className="lead">El newsletter El Valor Humano desarrolla nuestras preguntas sobre identidad, talento, educación, organizaciones, pensamiento propio, trabajo y futuro profesional. No es un catálogo de anuncios: es un espacio para formular nuevas preguntas.</p><div className="btn-row"><Link className="btn btn-white" href="/el-valor-humano"><span>Conocer el espacio editorial</span><span className="ico"><ArrowIcon /></span></Link><a className="btn btn-line" href="https://www.linkedin.com/newsletters/el-valor-humano-7512193265182564352/" target="_blank" rel="noopener noreferrer">Suscribirme en LinkedIn</a></div></div>
          <blockquote className="bigquote">Un currículum puede decir dónde trabajaste. No siempre explica cómo aprendes, cómo decides o qué sabes aportar.</blockquote>
        </Reveal></div></section>
        <section className="sec-s"><div className="wrap"><Reveal><div className="cta-band"><span className="deco" aria-hidden="true" /><span className="deco two" aria-hidden="true" /><h2>¿Qué podrías descubrir sobre ti?</h2><p>Empieza por comprender tus capacidades. Después decides si quieres desbloquear el informe completo.</p><div className="btn-row"><Link className="btn btn-primary" href="/tests"><span>Empieza sin pagar</span><span className="ico"><ArrowIcon /></span></Link><Link className="btn btn-line" href="/#ejemplo">Ver un informe de ejemplo</Link></div></div></Reveal></div></section>
        <EcosystemSection />
      </main>
      <LandingFooter /><WhatsAppFloat />
    </>
  );
}

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7" /><path d="M8 7h9v9" /></svg>;
}
