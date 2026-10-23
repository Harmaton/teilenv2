"use client";

import { useState, type FormEvent } from "react";
import { BookOpenCheck, GraduationCap, UsersRound, X } from "lucide-react";
import Link from "next/link";
import LandingNav from "./nav";
import Reveal from "./reveal";
import EcosystemSection from "./ecosystem-section";
import LandingFooter, { WhatsAppFloat } from "./footer";

const schoolFormats = [
  {
    icon: UsersRound,
    title: "Experiencia individual",
    className: "",
    description: "Las familias acceden desde el sitio y cada participante gestiona su evaluación, su autorización y, si quiere, la compra del informe.",
  },
  {
    icon: GraduationCap,
    title: "Campaña institucional",
    className: "t-violet",
    description: "El colegio coordina una convocatoria, informa a los responsables y acompaña el proceso con acuerdos y permisos definidos.",
  },
  {
    icon: BookOpenCheck,
    title: "Curso piloto",
    className: "t-sun",
    description: "Una experiencia controlada con una sección del colegio, orientación inicial para docentes y una evaluación posterior de su utilidad.",
  },
];

const testimonial = {
  quote: "Teilen llegó a mi vida personal y profesional en el momento indicado.",
  full: "En nuestra escuela pedagógica conviven estudiantes adultos entusiastas y comprometidos con la carrera que eligieron, y otros que trabajan para sostener a sus familias y cargan dificultades desde la infancia y la adolescencia. A muchos no les queda tiempo para pensar en sí mismos, en su futuro ni en las decisiones que tomaron. Teilen llegó a mi vida personal y profesional en el momento indicado. Conocerme más, descubrir mis talentos, habilidades, estilo de aprendizaje y potencial me ha permitido acercarme mejor a ellos, escucharlos con atención y ayudarlos a construir su proyecto de vida. En la vida todo tiene un propósito, y la misión es ser: pensando en ti y en los demás.",
};

export default function SchoolsPage() {
  return (
    <>
      <LandingNav activePage="/colegios" />
      <main id="contenido">
        <SchoolsHero />
        <SchoolFormats />
        <SchoolRole />
        <WhatWeDoNotOffer />
        <EducationStories />
        <InstitutionContact />
        <SchoolsCta />
        <EcosystemSection />
      </main>
      <LandingFooter />
      <WhatsAppFloat />
    </>
  );
}

function SchoolsHero() {
  return (
    <section className="phero bg-ink dots">
      <div className="wrap">
        <div className="phero-grid">
          <div>
            <span className="sticker crumb">Para colegios e instituciones</span>
            <h1>Orientar no es elegir una carrera por el estudiante.</h1>
            <p className="lead">Teilen ayuda a abrir una conversación anterior: qué capacidades aparecen, cómo aprende cada joven y qué escenarios merece explorar. Una herramienta complementaria para tutoría, familias y orientación educativa.</p>
            <div className="btn-row">
              <a className="btn btn-primary" href="#contacto"><span>Pedir una reunión institucional</span><span className="ico"><ArrowIcon /></span></a>
              <Link className="btn btn-line" href="/#ejemplo">Ver el informe de ejemplo</Link>
            </div>
          </div>
          <div className="phero-visual">
            <figure className="photo" style={{ margin: 0 }}>
              <img src="/assets/editorial-1.webp" alt="Estudiantes trabajando en grupo con computadoras portátiles" loading="lazy" />
              <span className="lbl">Imagen ilustrativa</span>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}

function SchoolFormats() {
  return (
    <section className="sec bg-paper">
      <div className="wrap">
        <Reveal className="head">
          <h2>De un cuestionario aislado a una conversación con continuidad.</h2>
          <p className="lead">La institución puede acompañar la evaluación con actividades para leer el informe, conversar sobre sus hallazgos y probar hipótesis de futuro. Teilen no pretende reemplazar al docente ni al orientador.</p>
        </Reveal>
        <div className="grid-3 mt-l">
          {schoolFormats.map(({ icon: Icon, title, className, description }) => (
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

function SchoolRole() {
  return (
    <section className="sec bg-white">
      <div className="wrap">
        <Reveal className="split">
          <div className="stack-lg">
            <h2>El informe abre preguntas. La escuela les da contexto.</h2>
            <p className="lead">El proyecto de vida no aparece por imprimir un PDF. Se construye cuando el estudiante observa su identidad, la contrasta con experiencias y encuentra adultos que acompañan sin imponer una respuesta.</p>
          </div>
          <div className="tile lift">
            <ul className="checks">
              <li><span>Material explicativo para familias y estudiantes.</span></li>
              <li><span>Posibilidad de diseñar una sesión de lectura en tutoría.</span></li>
              <li><span>Orientación docente de 45 minutos para programas piloto, sujeta a acuerdo.</span></li>
              <li><span>Datos agregados solo con base legal, umbrales adecuados y garantías contra la reidentificación.</span></li>
              <li><span>Sin rankings individuales ni entrega automática de perfiles a instituciones.</span></li>
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function WhatWeDoNotOffer() {
  return (
    <section className="sec-s bg-paper">
      <div className="wrap">
        <Reveal>
          <article className="nocard">
            <span className="x"><X aria-hidden="true" /></span>
            <div>
              <p className="kicker">Lo que no ofrecemos</p>
              <h2>Un panel para clasificar alumnos.</h2>
              <p>Los resultados individuales no deben convertirse en una herramienta de admisión, segregación escolar o selección laboral. La información personal pertenece al proceso de autoconocimiento del estudiante y se maneja según el consentimiento y la política de privacidad aplicable.</p>
              <p><strong>Una evaluación digital puede complementar la orientación.</strong> Nunca sustituye la responsabilidad pedagógica ni impone trayectorias académicas.</p>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}

function EducationStories() {
  return (
    <section className="sec bg-lilac">
      <div className="wrap">
        <Reveal className="head"><h2>Los retos de los estudiantes también piden nuevas conversaciones.</h2></Reveal>
        <div className="grid-2 mt-l" style={{ alignItems: "start" }}>
          <Reveal>
            <article className="persp">
              <span className="sticker violet">Perspectiva educativa</span>
              <h3>Claudia Marcela Baena Torres</h3>
              <p className="role">Magíster en Educación y directiva docente. Medellín, Colombia</p>
              <p>Compartió su preocupación por la desmotivación hacia los estudios posteriores a la secundaria y por el uso problemático de la tecnología. Su aporte describe un problema educativo; no se presenta como un testimonio de uso de Teilen.</p>
            </article>
          </Reveal>
          <Reveal>
            <article className="testi" data-type="educacion">
              <div className="t-top"><span className="tag">Educación</span><span className="t-country"><PinIcon />Perú</span></div>
              <blockquote className="t-hl">“{testimonial.quote}”</blockquote>
              <details className="t-more">
                <summary><span className="t-open">Leer testimonio completo</span><span className="t-close">Cerrar</span><ChevronIcon /></summary>
                <p>{testimonial.full}</p>
              </details>
              <div className="person">
                <span className="initials" aria-hidden="true">JI</span>
                <div>
                  <strong>Jahzeel Alexia Inga Vela</strong>
                  <span>Directora de la Escuela de Educación Superior Pedagógica Pública «Loreto»</span>
                  <span className="t-place">Iquitos, Perú</span>
                  <a className="t-link" href="https://www.instagram.com/jahzeel.inga26" target="_blank" rel="noopener noreferrer"><InstagramIcon /><span>Instagram</span></a>
                </div>
              </div>
            </article>
          </Reveal>
        </div>
        <div className="mt-m"><Link className="text-link" href="/experiencias">Leer las experiencias completas</Link></div>
      </div>
    </section>
  );
}

function InstitutionContact() {
  const [message, setMessage] = useState("");

  const submitRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const values = new FormData(form);
    const fields = [
      ["Nombre y apellido", values.get("nombre")],
      ["Cargo", values.get("cargo")],
      ["Institución", values.get("institucion")],
      ["País y ciudad", values.get("pais")],
      ["Correo", values.get("email")],
      ["Cantidad aproximada de estudiantes", values.get("estudiantes")],
      ["¿Qué te gustaría lograr?", values.get("mensaje")],
    ].filter(([, value]) => String(value ?? "").trim());
    const body = fields.map(([label, value]) => `${label}: ${String(value).trim()}`).join("\n");
    const subject = encodeURIComponent("Teilen Teens: presentación institucional");
    window.location.href = `mailto:talento@teilenteens.com?subject=${subject}&body=${encodeURIComponent(body)}`;
    setMessage("Abrimos tu aplicación de correo con la solicitud lista. Revísala y envíala desde allí.");
  };

  return (
    <section className="sec bg-ink dots" id="contacto">
      <div className="wrap">
        <div className="split top">
          <Reveal className="stack-lg sticky">
            <div>
              <h2>Solicita una presentación institucional.</h2>
              <p className="lead">Podemos conversar sobre objetivos, población, cronograma, consentimiento de las familias, modalidad de acceso y el diseño de un piloto adecuado a tu institución.</p>
              <div className="btn-row" style={{ marginTop: "1.6rem" }}>
                <a className="btn btn-white" href="https://wa.me/5493517623874?text=Hola%2C%20represento%20a%20una%20instituci%C3%B3n%20educativa%20y%20quiero%20conocer%20Teilen%20Teens." target="_blank" rel="noopener noreferrer">
                  <span>Escribir por WhatsApp</span><span className="ico"><WhatsAppIcon /></span>
                </a>
              </div>
            </div>
          </Reveal>
          <Reveal>
            <form className="form" onSubmit={submitRequest}>
              <div className="fgrid">
                <div className="field"><label htmlFor="school-name">Nombre y apellido *</label><input id="school-name" name="nombre" type="text" required autoComplete="name" /></div>
                <div className="field"><label htmlFor="school-role">Cargo *</label><input id="school-role" name="cargo" type="text" required /></div>
                <div className="field"><label htmlFor="school-institution">Institución *</label><input id="school-institution" name="institucion" type="text" required autoComplete="organization" /></div>
                <div className="field"><label htmlFor="school-location">País y ciudad *</label><input id="school-location" name="pais" type="text" required /></div>
                <div className="field"><label htmlFor="school-email">Correo electrónico *</label><input id="school-email" name="email" type="email" required autoComplete="email" /></div>
                <div className="field"><label htmlFor="school-students">Cantidad aproximada de estudiantes <span style={{ fontWeight: 400, color: "var(--muted)" }}>(opcional)</span></label><input id="school-students" name="estudiantes" type="text" /></div>
                <div className="field full"><label htmlFor="school-message">¿Qué te gustaría lograr? *</label><textarea id="school-message" name="mensaje" required /></div>
                <label className="check"><input type="checkbox" name="acepto" required /><span>Acepto que se use mi correo para responder esta solicitud. No incluyo datos personales de estudiantes.</span></label>
              </div>
              <button type="submit" className="btn btn-primary btn-full"><span>Preparar mi solicitud por correo</span><span className="ico"><ArrowIcon /></span></button>
              <p className="form-msg" role="status" aria-live="polite" style={message ? { display: "block" } : undefined}>{message}</p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function SchoolsCta() {
  return (
    <section className="sec-s">
      <div className="wrap">
        <Reveal>
          <div className="cta-band">
            <span className="deco" aria-hidden="true" /><span className="deco two" aria-hidden="true" />
            <h2>El colegio puede abrir la puerta. El joven construye el camino.</h2>
            <p>Hablemos sobre una experiencia institucional que respete la identidad y la autonomía de tus estudiantes.</p>
            <div className="btn-row">
              <Link className="btn btn-white" href="/#pasos"><span>Conocer el producto</span><span className="ico"><ArrowIcon /></span></Link>
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

function WhatsAppIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 20l1.3-4A8.5 8.5 0 1 1 12 20.5a8.4 8.4 0 0 1-4-1z" /><path d="M9 8.8c0 3.5 2.7 6.2 6.2 6.2l1-1.6-2-1-1 .9a4 4 0 0 1-2.6-2.6l.9-1-1-2z" /></svg>;
}
