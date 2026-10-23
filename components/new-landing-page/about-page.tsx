import Link from "next/link";
import LandingNav from "./nav";
import Reveal from "./reveal";
import EcosystemSection from "./ecosystem-section";
import LandingFooter, { WhatsAppFloat } from "./footer";

const team = [
  {
    name: "Salomón Boss",
    role: "Fundador y dirección metodológica",
    description: "Psicología, filosofía, coaching y desarrollo humano al servicio de una forma distinta de comprender el talento.",
    image: "/assets/salomon.webp",
    alt: "Retrato de Salomón Boss",
  },
  {
    name: "Harmaton Njagi",
    role: "Ingeniería y plataforma",
    description: "Desarrollo técnico, implementación de la experiencia digital y evolución tecnológica de Teilen.",
    image: "/assets/harmaton.webp",
    alt: "Retrato de Harmaton Njagi",
  },
  {
    name: "Pietro Moura",
    role: "Investigación y metodología",
    description: "Revisión de fundamentos y consistencia de la arquitectura interpretativa del proyecto.",
    image: "/assets/pietro.webp",
    alt: "Retrato de Pietro Moura",
  },
];

export default function AboutPage() {
  return (
    <>
      <LandingNav activePage="/nosotros" />
      <main id="contenido">
        <AboutHero />
        <AboutPurpose />
        <AboutStory />
        <AboutTeam />
        <FoundationSection />
        <AboutCta />
        <EcosystemSection />
      </main>
      <LandingFooter />
      <WhatsAppFloat />
    </>
  );
}

function AboutHero() {
  return (
    <section className="phero bg-ink dots">
      <div className="wrap">
        <Reveal>
          <span className="sticker crumb">Las personas detrás de la idea</span>
          <h1>Antes de intentar orientar a alguien, queremos comprenderlo mejor.</h1>
          <p className="lead" style={{ marginTop: "1.4rem" }}>
            Teilen nació del trabajo con adultos, profesionales y organizaciones, donde una misma inquietud aparecía una y otra vez: ¿qué habría cambiado si hubiéramos comprendido nuestras capacidades antes de tomar las primeras grandes decisiones?
          </p>
          <div className="btn-row" style={{ marginTop: "1.8rem" }}>
            <Link className="btn btn-primary" href="/tests"><span>Empieza sin pagar</span><span className="ico"><ArrowIcon /></span></Link>
            <Link className="btn btn-line" href="/#ejemplo">Ver un informe de ejemplo</Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function AboutPurpose() {
  return (
    <section className="sec bg-orange">
      <div className="wrap">
        <Reveal className="stack-lg">
          <p className="statement">Hacer accesible la interpretación del talento humano.</p>
          <p className="lead" style={{ color: "var(--ink)", maxWidth: "42em" }}>
            Combinamos metodología, tecnología y lenguaje humano para que el autoconocimiento no termine en una descripción, sino que abra oportunidades concretas para experimentar, aprender y construir.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function AboutStory() {
  return (
    <section className="sec bg-white">
      <div className="wrap">
        <Reveal className="split">
          <div className="stack">
            <h2>Lo que muchas personas descubren después, podría explorarse antes.</h2>
            <p className="lead">
              Durante años de trabajo con ejecutivos, profesionales y equipos surgió una observación recurrente: los conocimientos acumulados no siempre explicaban dónde una persona se sentía más capaz de aportar, ni por qué ciertas decisiones le resultaban tan difíciles.
            </p>
            <p>
              Teilen comenzó con evaluaciones extensas e informes técnicos. El desafío fue transformar esa complejidad en información clara, útil y accesible. Ese recorrido impulsó una versión para jóvenes: si muchas preguntas aparecen en la vida profesional adulta, podemos empezar a trabajarlas antes de terminar el colegio.
            </p>
            <p><strong>No buscamos que un software elija por una persona.</strong> Buscamos que tenga información y mejores preguntas para construir su propia dirección.</p>
          </div>
          <div className="phero-visual">
            <figure className="photo" style={{ margin: 0 }}>
              <img src="/assets/editorial-3.webp" alt="Jóvenes y un adulto trabajando juntos al aire libre" loading="lazy" />
              <span className="lbl">Fotografía ilustrativa</span>
            </figure>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function AboutTeam() {
  return (
    <section className="sec bg-paper">
      <div className="wrap">
        <Reveal className="head"><h2>Humanismo, investigación e ingeniería en una misma conversación.</h2></Reveal>
        <div className="team">
          {team.map((member) => (
            <Reveal key={member.name}>
              <article className="member">
                <figure><img src={member.image} alt={member.alt} loading="lazy" /></figure>
                <h3>{member.name}</h3>
                <p className="role">{member.role}</p>
                <p>{member.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FoundationSection() {
  return (
    <section className="sec bg-lilac">
      <div className="wrap">
        <Reveal>
          <article className="sl-box">
            <img src="/assets/simplelife-logo.png" alt="Fundación Simple Life" width="210" height="42" />
            <div>
              <h2>Simple Life: una mirada sobre el valor humano.</h2>
              <p>La Fundación Simple Life impulsa el propósito educativo y social que acompaña el desarrollo de Teilen y de Werden: ampliar el acceso a herramientas para identificar, entrenar y proyectar capacidades.</p>
              <p>Contacto institucional: Salomón Boss, Córdoba, Argentina.</p>
              <div className="btn-row mt-m">
                <Link className="btn btn-ink" href="/contacto"><span>Contactar al equipo</span><span className="ico"><ArrowIcon /></span></Link>
              </div>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}

function AboutCta() {
  return (
    <section className="sec-s">
      <div className="wrap">
        <Reveal>
          <div className="cta-band">
            <span className="deco" aria-hidden="true" /><span className="deco two" aria-hidden="true" />
            <h2>¿Qué podrías descubrir sobre ti?</h2>
            <p>Empieza por comprender tus capacidades. Después decides si quieres desbloquear el informe completo.</p>
            <div className="btn-row">
              <Link className="btn btn-primary" href="/tests"><span>Empieza sin pagar</span><span className="ico"><ArrowIcon /></span></Link>
              <Link className="btn btn-line" href="/#ejemplo">Ver un informe de ejemplo</Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7" /><path d="M8 7h9v9" /></svg>;
}
