"use client";

import { useRef, useState, type RefObject } from "react";
import { ArrowLeft, ArrowRight, UsersRound } from "lucide-react";
import Link from "next/link";
import LandingNav from "./nav";
import Reveal from "./reveal";
import EcosystemSection from "./ecosystem-section";
import LandingFooter, { WhatsAppFloat } from "./footer";
import { experiences, experienceCategories, type Experience, type ExperienceType } from "./experience-data";

const initials = ["DA", "JC", "TD", "MD", "JI", "ML", "MB", "LF", "MA", "VG", "JC", "DV", "AB", "MA", "MA"];
const countries = ["Argentina", "Bolivia", "Chile", "Colombia", "Costa Rica", "Ecuador", "Nicaragua", "Perú"];

export default function ExperiencesPage() {
  const [filter, setFilter] = useState<"todas" | ExperienceType>("todas");
  const carouselRef = useRef<HTMLDivElement>(null);
  const visibleExperiences = filter === "todas" ? experiences : experiences.filter((item) => item.type === filter);

  const moveCarousel = (direction: -1 | 1) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const card = carousel.querySelector<HTMLElement>(".testi");
    carousel.scrollBy({ left: direction * ((card?.offsetWidth ?? 380) + 20), behavior: "smooth" });
  };

  return (
    <>
      <LandingNav activePage="/experiencias" />
      <main id="contenido">
        <ExperiencesHero />
        <PeopleNote />
        <TestimonialsSection
          filter={filter}
          onFilter={setFilter}
          items={visibleExperiences}
          carouselRef={carouselRef}
          onMove={moveCarousel}
        />
        <EducationPerspective />
        <ExperiencesCta />
        <EcosystemSection />
      </main>
      <LandingFooter />
      <WhatsAppFloat />
    </>
  );
}

function ExperiencesHero() {
  return (
    <section className="phero bg-sun dots-ink">
      <div className="wrap">
        <div className="phero-grid">
          <div>
            <span className="sticker crumb">Experiencias reales, sin fotos prestadas</span>
            <h1>Lo que otras personas encontraron en Teilen.</h1>
            <p className="lead">Madres, padres, educadores y profesionales de distintos países cuentan qué encontraron en Teilen. Todos autorizaron publicar su nombre y su perfil. Sus textos se editaron para facilitar la lectura, conservando su significado. No son evidencia de validez científica.</p>
            <div className="btn-row">
              <Link className="btn btn-primary" href="/tests"><span>Empieza sin pagar</span><span className="ico"><ArrowIcon /></span></Link>
              <Link className="btn btn-line" href="/#ejemplo">Ver un informe de ejemplo</Link>
            </div>
          </div>
          <div className="phero-visual">
            <div className="avatars" aria-hidden="true">
              {initials.map((item, index) => <span key={`${item}-${index}`}>{item}</span>)}
            </div>
            <p className="avatars-cap">15 experiencias con nombre, rol y país, desde 8 países.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PeopleNote() {
  return (
    <section className="sec-s bg-white">
      <div className="wrap">
        <Reveal>
          <div className="callout mint">
            <span className="ic"><UsersRound aria-hidden="true" /></span>
            <div><p><strong>Las palabras tienen una persona detrás.</strong> Mostramos nombre, rol, ciudad y país, y el enlace a su perfil público cuando lo compartieron. Preferimos iniciales reales antes que fotografías genéricas que podrían confundirse con quien da su testimonio.</p></div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function TestimonialsSection({
  filter,
  onFilter,
  items,
  carouselRef,
  onMove,
}: {
  filter: "todas" | ExperienceType;
  onFilter: (filter: "todas" | ExperienceType) => void;
  items: Experience[];
  carouselRef: RefObject<HTMLDivElement | null>;
  onMove: (direction: -1 | 1) => void;
}) {
  return (
    <section className="sec bg-paper">
      <div className="wrap">
        <Reveal className="head"><h2>Experiencias de quienes probaron la herramienta, desde distintos lugares.</h2></Reveal>
        <Reveal>
          <div className="t-stats">
            <div><b>15</b><span>experiencias con nombre y apellido</span></div>
            <div><b>8</b><span>países</span></div>
            <div className="t-countries">{countries.map((country) => <span key={country}>{country}</span>)}</div>
          </div>
        </Reveal>
        <div className="experience-list">
          <div className="t-tools">
            <div className="filters" role="group" aria-label="Filtrar experiencias">
              {experienceCategories.map(({ id, label, count }) => (
                <button key={id} type="button" aria-pressed={filter === id} onClick={() => onFilter(id)}>{label} <i>{count}</i></button>
              ))}
            </div>
            <div className="car-ctrl">
              <button type="button" onClick={() => onMove(-1)} aria-label="Experiencia anterior"><ArrowLeft aria-hidden="true" /></button>
              <button type="button" onClick={() => onMove(1)} aria-label="Siguiente experiencia"><ArrowRight aria-hidden="true" /></button>
            </div>
          </div>
          <div className="carousel" ref={carouselRef} tabIndex={0} aria-label="Experiencias" style={{ display: "flex", overflowX: "auto", scrollSnapType: "x mandatory" }}>
            {items.map((experience) => (
              <article className="testi" key={experience.name}>
                <div className="t-top">
                  <span className="tag">{experienceCategories.find((item) => item.id === experience.type)?.label}</span>
                  <span className="t-country"><PinIcon />{experience.country}</span>
                </div>
                <blockquote className="t-hl">“{experience.quote}”</blockquote>
                <p className="t-full">{experience.full}</p>
                <div className="person">
                  <span className="initials" aria-hidden="true">{experience.initials}</span>
                  <div>
                    <strong>{experience.name}</strong>
                    <span>{experience.role}</span>
                    <span className="t-place">{experience.location}</span>
                    {experience.profile && <a className="t-link" href={experience.profile} target="_blank" rel="noopener noreferrer"><ProfileIcon type={experience.profileKind} /><span>{experience.profileKind}</span></a>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
        <p className="tiny mt-m">Sobre estas experiencias: describen percepciones individuales y pueden corresponder a distintas versiones de Teilen. Las afirmaciones sobre utilidad no sustituyen estudios específicos de fiabilidad o validez. Los datos personales de hijos menores no se publican.</p>
      </div>
    </section>
  );
}

function EducationPerspective() {
  return (
    <section className="sec bg-lilac">
      <div className="wrap">
        <Reveal className="split">
          <div className="stack">
            <h2>El problema también se escucha en las escuelas.</h2>
            <p className="lead">Una preocupación desde la dirección educativa.</p>
          </div>
          <article className="persp">
            <span className="sticker violet">Perspectiva educativa</span>
            <h3>Claudia Marcela Baena Torres</h3>
            <p className="role">Magíster en Educación · Directiva docente. Medellín, Colombia</p>
            <blockquote className="persp-q">“La mayoría de nuestros estudiantes está muy desmotivada con la educación superior: solo quiere terminar la secundaria y la media técnica para trabajar y tener ingresos. Muchos vienen de familias de bajos recursos y, aun así, las becas de educación superior se desperdician. A eso se suma el uso desmedido de las redes sociales y del celular: bullying, ciberbullying, retos virales y una adicción cada vez más difícil de manejar.”</blockquote>
            <p>Su aporte ayuda a contextualizar un desafío de orientación educativa; no se presenta como testimonio de haber usado Teilen.</p>
            <p className="mt-s"><a className="t-link" href="mailto:marcelabator@yahoo.com.ar"><MailIcon /><span>marcelabator [arroba] yahoo.com.ar</span></a></p>
          </article>
        </Reveal>
      </div>
    </section>
  );
}

function ExperiencesCta() {
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

function PinIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.4" /></svg>;
}

function ProfileIcon({ type }: { type?: "Instagram" | "LinkedIn" }) {
  return type === "LinkedIn"
    ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="2" /><path d="M8 10.5V16M8 7.6v.1M11.5 16v-3.2a2.3 2.3 0 0 1 4.5 0V16M11.5 10.5V16" /></svg>
    : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r=".6" fill="currentColor" /></svg>;
}

function MailIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m3.5 6.5 8.5 7 8.5-7" /></svg>;
}
