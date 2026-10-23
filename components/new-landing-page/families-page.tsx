"use client";

import { useRef, type RefObject } from "react";
import { ArrowLeft, ArrowRight, Brain, Compass, Crosshair, ShieldCheck } from "lucide-react";
import Link from "next/link";
import LandingNav from "./nav";
import Reveal from "./reveal";
import EcosystemSection from "./ecosystem-section";
import LandingFooter, { WhatsAppFloat } from "./footer";

const familyStories = [
  {
    type: "Familias",
    country: "Costa Rica",
    quote: "Fue como ponerle nombre y estructura a muchas cosas que ya estaban ahí.",
    full: "Mi hija de 17 años está decidiendo qué estudiar. Le apasiona la neurociencia desde la investigación, una carrera que todavía no se ofrece en nuestro país. Como mamá quería acompañarla sin imponerle una decisión, ayudándola a conocerse mejor. Lo que más me llamó la atención fue que el informe reconociera rasgos que yo también veo en ella: en sus estudios, sus pasatiempos, su forma de aprender y lo que despierta su curiosidad. Fue como ponerle nombre y estructura a muchas cosas que ya estaban ahí. Lo más valioso es que no le dice «esta es la carrera que debes estudiar»: le da información para conocerse, explorar y decidir de forma más consciente. Me permitió acompañarla desde otro lugar: no desde mis expectativas, sino desde sus fortalezas.",
    name: "Dylana Alvarado Coto",
    role: "Madre · Administradora de empresas",
    location: "Cartago, Costa Rica",
    initials: "DA",
    instagram: "https://www.instagram.com/dylana_alvarado",
  },
  {
    type: "Educación",
    country: "Chile",
    quote: "La dificultad de nuestros estudiantes no es la falta de información, sino la falta de acompañamiento.",
    full: "La principal dificultad de nuestros estudiantes no es la falta de información, sino la falta de acompañamiento, sobre todo cuando deben tomar decisiones importantes sobre su futuro. Muchos se sienten solos y, además, son los primeros de su familia en llegar a la educación superior. Me gustó mucho Teilen: es amigable, cómoda y fácil de usar, con una propuesta gráfica entretenida. Entrega información precisa y significativa y construye un perfil de personalidad que se siente muy cercano a la realidad. Es una excelente herramienta para acompañar a los estudiantes en su autoconocimiento y en sus decisiones.",
    name: "Juan Pablo Chavarría S.",
    role: "Orientador vocacional",
    location: "Santiago, Chile",
    initials: "JC",
  },
  {
    type: "Profesionales",
    country: "Nicaragua",
    quote: "Una lectura sólida y constructiva, tanto en lo personal como en lo profesional.",
    full: "Teilen me dio información detallada y clara para identificar los aspectos que debo seguir potenciando en mi vida. Tiene una lectura sólida y constructiva, tanto en lo personal como en lo profesional. Me resulta útil para tomar decisiones con determinación y para entender el impacto que mi comportamiento tiene en las personas que me rodean. Me encantó la herramienta y la experiencia que construye.",
    name: "Tommy Joseph Díaz Valverde",
    role: "Coaching profesional y psicología organizacional positiva",
    location: "Granada, Nicaragua",
    initials: "TD",
    instagram: "https://www.instagram.com/tommy.diaz_",
  },
];

export default function FamiliesPage() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const moveCarousel = (direction: -1 | 1) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const card = carousel.querySelector<HTMLElement>(".testi");
    carousel.scrollBy({ left: direction * ((card?.offsetWidth ?? 380) + 20), behavior: "smooth" });
  };

  return (
    <>
      <LandingNav activePage="/familias" />
      <main id="contenido">
        <FamiliesHero />
        <FamiliesContext />
        <FamilyBenefits />
        <GuardianConsent />
        <FamilyStories carouselRef={carouselRef} onMove={moveCarousel} />
        <FamilyConversation />
        <FamiliesCta />
        <EcosystemSection />
      </main>
      <LandingFooter />
      <WhatsAppFloat />
    </>
  );
}

function FamiliesHero() {
  return (
    <section className="phero bg-paper dots-ink">
      <div className="wrap">
        <div className="phero-grid">
          <div>
            <span className="sticker crumb">Para madres, padres y responsables</span>
            <h1>Tu hijo no necesita que elijas su futuro por él.</h1>
            <p className="lead">Necesita mejores herramientas para comprender sus capacidades y construir criterio propio. Teilen permite pasar de las suposiciones a conversaciones basadas en información sobre identidad y desarrollo.</p>
            <div className="btn-row">
              <Link className="btn btn-primary" href="/tests"><span>Empieza sin pagar</span><span className="ico"><ArrowIcon /></span></Link>
              <Link className="btn btn-white" href="/#ejemplo">Ver un informe de ejemplo</Link>
            </div>
          </div>
          <div className="phero-visual">
            <figure className="photo" style={{ margin: 0 }}>
              <img src="/assets/editorial-3.webp" alt="Jóvenes y un adulto trabajando juntos en un proyecto comunitario" loading="lazy" />
              <span className="lbl">Imagen ilustrativa</span>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}

function FamiliesContext() {
  return (
    <section className="sec bg-white">
      <div className="wrap">
        <Reveal className="split">
          <div className="stack">
            <h2>Antes de preguntarle «¿qué vas a estudiar?», ¿sabemos en qué es realmente bueno?</h2>
            <p className="lead">Conocemos sus notas, sus hábitos y muchas de sus preferencias. Eso no siempre equivale a comprender cómo aprende, qué patrones repite, qué capacidades aparecen naturalmente o en qué situaciones genera valor.</p>
            <p>Teilen no promete resolver una vida con cinco minutos de respuestas. Entrega información estructurada que puede abrir nuevas conversaciones y orientar las experiencias que conviene explorar después.</p>
          </div>
          <blockquote className="bigquote">Saber qué carrera le interesa no significa comprender todavía qué tiene para ofrecer.</blockquote>
        </Reveal>
      </div>
    </section>
  );
}

function FamilyBenefits() {
  const benefits = [
    { icon: Crosshair, title: "Reconocer capacidades", className: "t-orange", description: "El informe identifica habilidades y fortalezas predominantes desde una interpretación que pueden discutir y contrastar con la vida cotidiana." },
    { icon: Brain, title: "Comprender cómo funciona", className: "t-violet", description: "Incluye su forma de aprender, decidir y resolver problemas, y algunos patrones que pueden requerir atención." },
    { icon: Compass, title: "Explorar posibilidades", className: "t-sun", description: "Presenta cuatro escenarios distintos para hablar del futuro sin limitarlo a una lista de carreras universitarias." },
  ];
  return (
    <section className="sec bg-paper">
      <div className="wrap">
        <Reveal className="head"><h2>Más información para él. Mejores preguntas para ti.</h2></Reveal>
        <div className="grid-3 mt-l">
          {benefits.map(({ icon: Icon, title, className, description }) => (
            <Reveal key={title}>
              <article className={`tile ${className} lift`}>
                <span className="ic"><Icon aria-hidden="true" /></span>
                <h3>{title}</h3><p>{description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function GuardianConsent() {
  const authorizationSteps = [
    ["El trámite empieza", "Lo inicia el adolescente o su responsable."],
    ["El adulto verifica", "Recibe un enlace de verificación y la información necesaria."],
    ["Autorizar no es comprar", "La autorización para la evaluación es independiente de la compra."],
    ["El joven confirma", "Acepta participar y responde personalmente."],
    ["Reglas claras después", "El acceso al informe y al chat sigue reglas de privacidad definidas."],
  ];

  return (
    <section className="sec bg-ink dots">
      <div className="wrap">
        <div className="split top">
          <Reveal className="stack-lg">
            <div>
              <h2>Si tu hijo es menor, tu autorización llega antes de la evaluación.</h2>
              <p className="lead" style={{ marginTop: "1rem" }}>Teilen está pensado para participantes desde los 13 años. Entre 13 y 17, se pide la autorización verificable de madre, padre o responsable legal, y una aceptación clara del propio adolescente, antes de recoger las respuestas.</p>
              <div className="callout violet" style={{ marginTop: "1.6rem" }}>
                <span className="ic"><ShieldCheck aria-hidden="true" /></span>
                <div><p><strong>¿Qué no compartimos por WhatsApp?</strong> Las respuestas personales, las puntuaciones ni las conversaciones del joven. El mensaje de invitación solo contiene lo necesario para la autorización o una compra segura asociada a la cuenta.</p></div>
              </div>
              <Link className="text-link" href="/menores" style={{ display: "inline-block", marginTop: "1.4rem" }}>Cómo funciona la autorización familiar</Link>
            </div>
          </Reveal>
          <Reveal className="stack-lg">
            <div>
              <h3>El adulto acompaña, el joven responde.</h3>
              <ol className="vsteps">
                {authorizationSteps.map(([title, description], index) => (
                  <li key={title}><b>{index + 1}</b><div><h3>{title}</h3><p>{description}</p></div></li>
                ))}
              </ol>
              <div className="btn-row" style={{ marginTop: "1.6rem" }}>
                <Link className="btn btn-primary" href="/#pasos"><span>Conocer el producto</span><span className="ico"><ArrowIcon /></span></Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function FamilyStories({ carouselRef, onMove }: { carouselRef: RefObject<HTMLDivElement | null>; onMove: (direction: -1 | 1) => void }) {
  return (
    <section className="sec bg-paper">
      <div className="wrap">
        <Reveal className="head"><h2>Experiencias familiares, contadas desde la práctica.</h2></Reveal>
        <div className="family-stories">
          <div className="t-tools">
            <span />
            <div className="car-ctrl">
              <button type="button" onClick={() => onMove(-1)} aria-label="Testimonio anterior"><ArrowLeft aria-hidden="true" /></button>
              <button type="button" onClick={() => onMove(1)} aria-label="Siguiente testimonio"><ArrowRight aria-hidden="true" /></button>
            </div>
          </div>
          <div className="carousel" ref={carouselRef} tabIndex={0} aria-label="Experiencias de familias, educadores y profesionales">
            {familyStories.map((story) => (
              <article className="testi" key={story.name}>
                <div className="t-top"><span className="tag">{story.type}</span><span className="t-country"><PinIcon />{story.country}</span></div>
                <blockquote className="t-hl">“{story.quote}”</blockquote>
                <details className="t-more">
                  <summary><span className="t-open">Leer testimonio completo</span><span className="t-close">Cerrar</span><ChevronIcon /></summary>
                  <p>{story.full}</p>
                </details>
                <div className="person">
                  <span className="initials" aria-hidden="true">{story.initials}</span>
                  <div>
                    <strong>{story.name}</strong><span>{story.role}</span><span className="t-place">{story.location}</span>
                    {story.instagram && <a className="t-link" href={story.instagram} target="_blank" rel="noopener noreferrer"><InstagramIcon /><span>Instagram</span></a>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
        <p className="tiny mt-m">Percepciones personales de madres que usaron Teilen. Los datos de sus hijos no se publican.</p>
      </div>
    </section>
  );
}

function FamilyConversation() {
  const questions = [
    ["¿Qué disfrutas resolver?", "En lugar de pedirle el nombre de una carrera, pregúntale qué problemas despiertan su curiosidad."],
    ["¿Qué haces de otra manera?", "Pídele ejemplos de situaciones concretas, no solo calificativos como «soy creativo» o «soy bueno en tecnología»."],
    ["¿Qué te gustaría probar?", "Una decisión importante se construye mejor cuando hay permiso para experimentar antes de comprometer años de vida."],
  ];
  return (
    <section className="sec bg-white">
      <div className="wrap">
        <Reveal className="head"><h2>Tres preguntas que puedes hacerle esta misma semana.</h2></Reveal>
        <div className="bubbles">
          {questions.map(([question, description]) => (
            <Reveal key={question}><article className="bubble"><q>{question}</q><p>{description}</p></article></Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FamiliesCta() {
  return (
    <section className="sec-s">
      <div className="wrap">
        <Reveal>
          <div className="cta-band">
            <span className="deco" aria-hidden="true" /><span className="deco two" aria-hidden="true" />
            <h2>Puedes acompañar mejor sin elegir por él.</h2>
            <p>Descubre cómo se organiza la Identidad Evolutiva y comparte con tu hijo un lenguaje para conversar sobre su futuro.</p>
            <div className="btn-row">
              <Link className="btn btn-white" href="/#pasos"><span>Conocer Teilen</span><span className="ico"><ArrowIcon /></span></Link>
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

function PinIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.4" /></svg>;
}

function ChevronIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>;
}

function InstagramIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r=".6" fill="currentColor" /></svg>;
}
