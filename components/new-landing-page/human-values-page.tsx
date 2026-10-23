import Link from "next/link";
import LandingNav from "./nav";
import Reveal from "./reveal";
import EcosystemSection from "./ecosystem-section";
import LandingFooter, { WhatsAppFloat } from "./footer";

const newsletterUrl = "https://www.linkedin.com/newsletters/el-valor-humano-7512193265182564352/";
const topics = [
  { tag: "Identidad", title: "¿En qué eres bueno? La pregunta que debería llegar antes de «qué vas a estudiar». ", description: "Durante generaciones enseñamos a elegir profesiones antes de enseñar a observar capacidades. ¿Qué cambiaría si invirtiéramos el orden?" },
  { tag: "Trabajo", title: "El currículum sabe lo que hiciste. ¿Quién cuenta cómo funcionas?", description: "Los títulos narran una parte de la historia. La forma de aprender, colaborar, decidir y crear valor necesita otros lenguajes y evidencias." },
  { tag: "Formación", title: "No puedes entrenar una habilidad desde una diapositiva.", description: "La adaptabilidad se descubre cuando algo cambia. El criterio aparece cuando hay alternativas reales. La comunicación se entrena al construir algo con otros." },
];

export default function HumanValuesPage() {
  return (
    <>
      <LandingNav activePage="/el-valor-humano" />
      <main id="contenido">
        <section className="phero bg-paper dots-ink"><div className="wrap"><Reveal>
          <span className="sticker crumb">Newsletter y pensamiento</span><h1>El Valor Humano. Las preguntas que nos faltaba hacer.</h1>
          <p className="lead" style={{ marginTop: "1.4rem" }}>Una publicación para cuestionar cómo interpretamos hoy el talento, la identidad, el trabajo y las decisiones. Aquí conectamos el pensamiento detrás de Teilen con los desafíos de jóvenes, familias y organizaciones.</p>
          <div className="btn-row" style={{ marginTop: "1.8rem" }}><a className="btn btn-primary" href={newsletterUrl} target="_blank" rel="noopener noreferrer"><span>Suscribirme en LinkedIn</span><span className="ico"><LinkedInIcon /></span></a><Link className="btn btn-white" href="/#pasos">Conocer Teilen</Link></div>
        </Reveal></div></section>
        <section className="sec-s bg-ink"><div className="wrap"><Reveal><div className="nl"><span className="ch-ic"><LinkedInIcon /></span><div><h2>El Valor Humano, en LinkedIn</h2><p>Reflexiones originales de Salomón Boss sobre identidad, talento y nuevas maneras de construir el futuro profesional.</p></div><a className="btn btn-primary" href={newsletterUrl} target="_blank" rel="noopener noreferrer"><span>Suscribirme</span><span className="ico"><ArrowIcon /></span></a></div></Reveal></div></section>
        <section className="sec bg-paper"><div className="wrap"><Reveal className="head"><h2>No más fórmulas. Preguntas que vale la pena sostener.</h2></Reveal>
          <div className="articles">{topics.map((topic) => <Reveal key={topic.title}><a className="article" href={newsletterUrl} target="_blank" rel="noopener noreferrer"><span className="tag">{topic.tag}</span><h3>{topic.title}</h3><p>{topic.description}</p><span className="go">Explorar el newsletter</span></a></Reveal>)}</div>
          <p className="tiny mt-m">Estos son temas que desarrolla el newsletter, no títulos de artículos ya publicados. El enlace oficial muestra las entregas disponibles.</p>
        </div></section>
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

function LinkedInIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="2" /><path d="M8 10.5V16M8 7.6v.1M11.5 16v-3.2a2.3 2.3 0 0 1 4.5 0V16M11.5 10.5V16" /></svg>;
}
