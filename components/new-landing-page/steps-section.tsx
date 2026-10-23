import { Brain, Clock3, FileText, LockKeyhole, MessageSquareText, Sparkles } from "lucide-react";
import Link from "next/link";
import Reveal from "./reveal";

const steps = [
  {
    title: "Contesta la evaluación",
    description: "En unos cinco minutos compartes respuestas sobre tus preferencias, situaciones y percepciones. Si tienes entre 13 y 17 años, primero un adulto responsable da su autorización verificable.",
    badges: [{ icon: Clock3, text: "≈ 5 min" }, { icon: LockKeyhole, text: "Sin tarjeta" }],
  },
  {
    title: "Se procesan los resultados",
    description: "El motor metodológico calcula una salida técnica con su propia lógica de evaluación. Después, la inteligencia artificial la expresa en un lenguaje claro y construye el informe. No asigna las puntuaciones.",
    badges: [{ icon: Brain, text: "Motor metodológico" }, { icon: MessageSquareText, text: "IA que explica" }],
  },
  {
    title: "Decides si lo desbloqueas",
    description: "Ves cómo es el producto y, por USD 50, accedes al informe PDF de cinco páginas y a cinco preguntas con Salomón IA en tu espacio personal.",
    badges: [{ icon: FileText, text: "USD 50, pago único" }],
  },
];

export function StepsSection() {
  return (
    <section className="sec bg-paper" id="pasos">
      <div className="wrap">
        <Reveal className="head">
          <h2>Un recorrido sencillo. Una interpretación con profundidad.</h2>
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
          <h2>Un precio claro. Un informe que puedes conservar.</h2>
          <p className="lead">La evaluación inicial no requiere pago. El informe se desbloquea solo si eliges comprarlo después de completar la evaluación.</p>
        </Reveal>
        <div className="price-grid">
          <Reveal>
            <article className="ticket">
              <div className="ticket-top">
                <span className="sticker">Desbloqueo único</span>
                <div className="ticket-price"><small>USD</small><b>50</b></div>
                <h3>Identidad Evolutiva completa</h3>
                <p className="small" style={{ color: "var(--muted)", marginTop: 8 }}>Sin suscripción. Antes de confirmar el pago ves las condiciones de compra.</p>
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
                <div><p>Las ampliaciones futuras, si se ofrecen, se anunciarán con su alcance y sus condiciones antes de contratarlas. <a className="text-link" href="/terms-of-service">Leer condiciones y compras</a></p></div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function ValuesSection() {
  return (
    <section className="sec bg-paper">
      <div className="wrap">
        <Reveal className="head"><h2>La identidad no se decide con una etiqueta.</h2></Reveal>
        <div className="isnot">
          <Reveal>
            <article className="tile lift">
              <span className="ic"><CheckIcon /></span>
              <h3>Teilen es…</h3>
              <p>Una herramienta para organizar información sobre capacidades, valores, formas de aprender, patrones y posibilidades de desarrollo. Un punto de partida para conversar, probar y seguir descubriendo.</p>
            </article>
          </Reveal>
          <Reveal>
            <article className="tile lift">
              <span className="ic"><XIcon /></span>
              <h3>Teilen no es…</h3>
              <p>Una evaluación clínica, una decisión automática de carrera, una predicción sobre tu vida ni un sustituto de profesionales, tutores, experiencias académicas o del mundo del trabajo.</p>
            </article>
          </Reveal>
        </div>
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
            <h2>¿Listo para conocer tu Identidad Evolutiva?</h2>
            <p>El ejemplo te muestra cómo se ve. Tu evaluación construye tu propio informe.</p>
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

function CheckIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>;
}

function XIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>;
}
