import { Brain, Clock3, FileText, LockKeyhole, MessageSquareText, Sparkles } from "lucide-react";
import Link from "next/link";
import Reveal from "./reveal";
import LaunchOffer from "./launch-offer";

const steps = [
  {
    title: "Responde en unos 5 minutos",
    description: "Si tienes entre 13 y 17 años, primero una persona adulta responsable autoriza y tú aceptas participar. Después respondes a tu ritmo.",
    badges: [{ icon: Clock3, text: "≈ 5 min" }, { icon: LockKeyhole, text: "Sin tarjeta" }],
  },
  {
    title: "La ciencia calcula, la IA traduce",
    description: "El motor metodológico calcula tus resultados. La IA no inventa puntuaciones: las convierte en un informe claro y visual.",
    badges: [{ icon: Brain, text: "Motor metodológico" }, { icon: MessageSquareText, text: "IA que explica" }],
  },
  {
    title: "Desbloquea si quieres",
    description: "Primero ves cómo es el producto. Por USD 50 recibes el informe PDF de cinco páginas y cinco preguntas a Salomón IA en la plataforma.",
    badges: [{ icon: FileText, text: "USD 50, pago único" }],
  },
];

export function StepsSection() {
  return (
    <section className="sec bg-paper" id="pasos">
      <div className="wrap">
        <Reveal className="head">
          <h2>Respondes primero. Decides después.</h2>
          <p className="lead">Empiezas sin pagar. Comprar es una decisión posterior, con el producto y las condiciones a la vista.</p>
        </Reveal>
        <div className="steps">
          {steps.map((step, index) => (
            <Reveal key={step.title}>
              <article className="step">
                <span className="num">{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                <div className="ui chips">
                  {step.badges.map(({ icon: Icon, text }) => (
                    <span className="ui-pill" key={text}><Icon aria-hidden="true" /> {text}</span>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PriceSection() {
  return (
    <section className="sec bg-lilac" id="precio">
      <div className="wrap">
        <Reveal className="head">
          <h2>Descúbrelo primero. Paga solo si quieres profundizar.</h2>
          <p className="lead">No compras una interpretación a ciegas: empiezas sin tarjeta y ves el diseño del informe antes de desbloquear el tuyo.</p>
        </Reveal>
        <div className="price-grid">
          <Reveal>
            <article className="ticket">
              <div className="ticket-top">
                <span className="sticker">Desbloqueo único</span>
                <div className="ticket-price"><small>USD</small><b>50</b></div>
                <h3>Identidad Evolutiva completa</h3>
                <p className="small" style={{ color: "var(--muted)", marginTop: 8 }}>La moneda local, los impuestos y las condiciones se muestran antes de pagar.</p>
                <LaunchOffer />
              </div>
              <div className="ticket-cut" />
              <div className="ticket-bot">
                <ul className="checks">
                  <li><span>Informe PDF completo de 5 páginas</span></li>
                  <li><span>Un mapa visual y cuatro secciones de desarrollo</span></li>
                  <li><span>Cuatro escenarios posibles de futuro</span></li>
                  <li><span>5 preguntas con Salomón IA, dentro de la plataforma</span></li>
                  <li><span>Las condiciones de compra, visibles antes de pagar</span></li>
                </ul>
                <div className="mt-m"><Link className="btn btn-primary btn-full" href="/tests"><span>Empieza sin pagar</span><span className="ico"><ArrowIcon /></span></Link></div>
              </div>
            </article>
          </Reveal>
          <Reveal className="stack-lg">
            <div>
              <h3 className="h2" style={{ fontSize: "clamp(1.8rem,3vw,2.5rem)" }}>Cinco preguntas que puedes aprovechar de verdad.</h3>
              <p className="lead" style={{ marginTop: "1.1rem" }}>Salomón IA vive junto a tu informe. Úsalo para pedir ejemplos, comparar escenarios o preparar una conversación con tu familia.</p>
              <div className="btn-row" style={{ marginTop: "1.6rem" }}>
                <a className="btn btn-white" href="/salomon-ia"><span>Cómo funcionan las preguntas</span><span className="ico"><MessageSquareText aria-hidden="true" /></span></a>
              </div>
              <div className="callout violet mt-l">
                <span className="ic"><Sparkles aria-hidden="true" /></span>
                <div><p>Las ampliaciones futuras, si se ofrecen, se anunciarán con su alcance y sus condiciones antes de contratarlas. <a className="text-link" href="/terminos">Leer condiciones y compras</a></p></div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function ValuesSection() {
  const scenarios = [
    { title: "Formación", description: "Áreas de estudio que podrías explorar y contrastar con tus intereses y experiencias." },
    { title: "Profesiones emergentes", description: "Nuevos campos de trabajo que conectan capacidades personales con necesidades del mundo." },
    { title: "Emprendimiento", description: "Formas de convertir una idea, una habilidad o una inquietud en un proyecto." },
    { title: "Entorno de trabajo", description: "Condiciones y contextos que pueden ayudarte a aprender, colaborar y aportar." },
  ];

  return (
    <section className="sec bg-paper" id="escenarios">
      <div className="wrap">
        <Reveal className="head">
          <h2>Una misma capacidad puede abrir distintos futuros.</h2>
          <p className="lead">No es una etiqueta ni una respuesta cerrada: es un mapa para leerte mejor y explorar opciones.</p>
        </Reveal>
        <div className="grid-2">
          {scenarios.map((scenario, index) => (
            <Reveal key={scenario.title}>
              <article className="tile lift">
                <span className="kicker">Escenario 0{index + 1}</span>
                <h3>{scenario.title}</h3>
                <p>{scenario.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <p className="tiny mt-l">Son posibilidades para explorar, no predicciones ni recomendaciones automáticas de carrera.</p>
      </div>
    </section>
  );
}

export function CtaSection() {
  return (
    <section className="sec-s">
      <div className="wrap">
        <Reveal>
          <div className="cta-band">
            <span className="deco" aria-hidden="true" /><span className="deco two" aria-hidden="true" />
            <h2>¿Qué podrías descubrir sobre ti?</h2>
            <p>Empieza a explorar tus talentos, cómo aprendes y dónde podrías generar valor.</p>
            <div className="btn-row">
              <Link className="btn btn-primary" href="/tests"><span>Empieza sin pagar</span><span className="ico"><ArrowIcon /></span></Link>
              <a className="btn btn-line" href="#ejemplo">Ver otra vez el ejemplo</a>
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
