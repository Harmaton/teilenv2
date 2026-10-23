import Link from "next/link";
import { MessageCircle } from "lucide-react";
import LandingNav from "./nav";
import Reveal from "./reveal";
import EcosystemSection from "./ecosystem-section";
import LandingFooter, { WhatsAppFloat } from "./footer";

const familyShareMessage = "Hola, encontré Teilen Teens. Respondo la evaluación en unos 5 minutos sin tarjeta. Si quiero el informe completo de Identidad Evolutiva (5 páginas + 5 preguntas a Salomón IA), cuesta USD 50. ¿Lo vemos juntos? https://www.teilenteens.com/";

export default function YouthPage() {
  return (
    <>
      <LandingNav activePage="/jovenes" />
      <main id="contenido">
        <YouthHero />
        <YouthConcerns />
        <YouthIdentity />
        <YouthFamily />
        <YouthCta />
        <EcosystemSection />
      </main>
      <LandingFooter />
      <WhatsAppFloat />
    </>
  );
}

function YouthHero() {
  return (
    <section className="phero bg-violet dots">
      <div className="wrap">
        <div className="phero-grid">
          <div>
            <span className="sticker crumb">Este espacio es para ti</span>
            <h1>No eres una carrera. Eres mucho más.</h1>
            <p className="lead">Terminar la secundaria puede parecer una competencia por tener respuestas. Antes de que alguien te pregunte qué vas a hacer, vale la pena comprender qué tienes, cómo aprendes y qué problemas disfrutas resolver.</p>
            <div className="btn-row">
              <Link className="btn btn-primary" href="/tests"><span>Empieza sin pagar</span><span className="ico"><ArrowIcon /></span></Link>
              <Link className="btn btn-line" href="/#ejemplo">Ver un informe de ejemplo</Link>
            </div>
          </div>
          <div className="phero-visual">
            <span className="sticker">Sin tarjeta para empezar</span>
            <figure className="photo" style={{ margin: 0 }}>
              <img src="/assets/editorial-2.webp" alt="Jóvenes conversando frente a una computadora portátil" loading="lazy" />
              <span className="lbl">Imagen ilustrativa</span>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}

function YouthConcerns() {
  const concerns = [
    ["Me interesan demasiadas cosas.", "Tener muchos intereses no significa estar perdido. Quizá necesitas un criterio más claro para decidir dónde poner tu energía."],
    ["No destaco en nada.", "Una nota o una materia no resume tus capacidades. Hay formas de aportar que aparecen sobre todo fuera del examen."],
    ["Ya elegí, pero tengo dudas.", "Cambiar de preguntas no es fracasar. Puedes usar información sobre ti para mirar tu elección desde otros ángulos."],
  ];
  return (
    <section className="sec bg-paper">
      <div className="wrap">
        <Reveal className="head"><h2>Hay más de una forma de no tener claro el futuro.</h2></Reveal>
        <div className="bubbles">
          {concerns.map(([title, description]) => <Reveal key={title}><article className="bubble"><q>{title}</q><p>{description}</p></article></Reveal>)}
        </div>
      </div>
    </section>
  );
}

function YouthIdentity() {
  const identity = [
    ["Capacidades", "var(--orange)"],
    ["Valores", "var(--sun)"],
    ["Forma de aprender", "var(--white)"],
    ["Patrones", "var(--mint)"],
    ["Posibilidades", "var(--lilac)"],
  ];
  return (
    <section className="sec bg-ink dots">
      <div className="wrap">
        <Reveal className="split">
          <div className="stack-lg">
            <h2>En vez de preguntarte qué deberías ser, mira cómo eres hoy.</h2>
            <p className="lead">Tu Identidad Evolutiva reúne un mapa de lo que hoy aparece en tu forma de aprender, decidir y aportar. No te encierra: te da elementos para explorar.</p>
            <div className="btn-row"><Link className="btn btn-white" href="/#ejemplo">Quiero ver cómo es el informe</Link></div>
          </div>
          <div className="cloud" aria-label="Lo que muestra tu informe">
            {identity.map(([label, color]) => <span key={label} style={{ background: color }}>{label}</span>)}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function YouthFamily() {
  return (
    <section className="sec bg-sun">
      <div className="wrap">
        <Reveal className="split">
          <div className="stack-lg">
            <h2>No tienes que resolver también cómo pagarlo.</h2>
            <p className="lead" style={{ color: "var(--ink)" }}>Comparte con tu familia la explicación del producto. Si eres menor de edad, su autorización es necesaria antes de completar la evaluación, según el proceso y las exigencias de tu país.</p>
            <p>El pago se asocia a tu evaluación dentro de la plataforma. Tus respuestas nunca se envían por mensajería.</p>
            <div className="btn-row">
              <Link className="btn btn-primary" href="/tests"><span>Empieza sin pagar</span><span className="ico"><ArrowIcon /></span></Link>
              <a className="btn btn-ink" href={`https://wa.me/?text=${encodeURIComponent(familyShareMessage)}`} target="_blank" rel="noopener noreferrer"><span>Compartir con mi familia</span><span className="ico"><MessageCircle aria-hidden="true" /></span></a>
            </div>
            <Link className="text-link" href="/familias">Información para madres, padres y responsables</Link>
          </div>
          <div>
            <div className="phone" aria-label="Ejemplo de mensaje a la familia">
              <div className="phone-screen">
                <div className="phone-bar"><span className="av">F</span><div><strong>Familia</strong><span>en línea</span></div></div>
                <div className="phone-body">
                  <div className="msg me">Encontré Teilen Teens. Respondo en unos 5 minutos sin tarjeta. El informe completo con 5 preguntas a Salomón IA cuesta USD 50. ¿Lo vemos juntos?<span className="meta">18:42</span></div>
                  <div className="msg them">Dale, lo vemos esta noche.<span className="meta">18:45</span></div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function YouthCta() {
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
