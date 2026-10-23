"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Eye } from "lucide-react";
import Reveal from "./reveal";

const pages = [
  {
    title: "Mapa de Identidad Evolutiva",
    description: "Una síntesis visual: talento predominante, esencia, capacidades, condiciones de aprendizaje, aspectos que conviene cuidar, valores y dirección posible.",
    alt: "Mapa visual ficticio de Identidad Evolutiva",
  },
  {
    title: "Quién soy hoy",
    description: "Una lectura desarrollada de tu identidad, tus características distintivas y tus patrones observables, sin reducirte a una etiqueta fija.",
    alt: "Página de ejemplo sobre quién soy hoy",
  },
  {
    title: "En qué soy bueno y cómo funciono mejor",
    description: "Capacidades predominantes, situaciones que te ayudan a aprender y resolver problemas, y patrones que pueden limitar tu desarrollo.",
    alt: "Página de ejemplo sobre capacidades y formas de funcionar",
  },
  {
    title: "Dónde puedo generar más valor",
    description: "Formación, profesiones emergentes, emprendimiento y entornos laborales: cuatro hipótesis que vale la pena contrastar con experiencias reales.",
    alt: "Página de ejemplo sobre escenarios de valor",
  },
  {
    title: "Mi proyecto de vida",
    description: "Cómo convertir el autoconocimiento en preguntas, experimentos, criterios y primeras decisiones de corto plazo.",
    alt: "Página de ejemplo sobre un proyecto de vida",
  },
];

export default function ReportExample() {
  const [activePage, setActivePage] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (activePage === null) return;
    lastFocusRef.current = document.activeElement as HTMLElement | null;
    document.body.classList.add("lock");
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActivePage(null);
      if (event.key === "ArrowLeft") setActivePage((current) => current === null ? null : (current + pages.length - 1) % pages.length);
      if (event.key === "ArrowRight") setActivePage((current) => current === null ? null : (current + 1) % pages.length);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("lock");
      lastFocusRef.current?.focus();
    };
  }, [activePage]);

  const showPage = (index: number) => setActivePage((index + pages.length) % pages.length);
  const page = activePage === null ? null : pages[activePage];

  return (
    <>
      <section className="sec bg-white" id="ejemplo">
        <div className="wrap">
          <div className="split top">
            <Reveal className="sticky stack-lg">
              <div>
                <h2>Así se ve lo que vas a recibir.</h2>
                <p className="lead" style={{ marginTop: "1.1rem" }}>Abre las páginas del informe de Mateo, un caso ficticio. Muestra el diseño y la profundidad de los contenidos; no es la evaluación real de un estudiante.</p>
                <div className="btn-row" style={{ marginTop: "1.6rem" }}>
                  <button type="button" className="btn btn-ink" onClick={() => showPage(0)}>
                    <span>Abrir el informe de ejemplo</span><span className="ico"><Eye aria-hidden="true" /></span>
                  </button>
                </div>
                <p className="tiny" style={{ marginTop: "1rem" }}>Tu informe se construye con tus propios resultados.</p>
              </div>
            </Reveal>
            <div className="pages">
              {pages.map((reportPage, index) => (
                <Reveal key={reportPage.title}>
                  <button type="button" className="pagecard" onClick={() => showPage(index)} aria-label={`Abrir la página ${index + 1} del informe de ejemplo`}>
                    <img src={`/assets/reporte-${index}.webp`} alt="" width="120" height="170" loading="lazy" />
                    <div>
                      <span className="kicker">Página {index + 1}</span>
                      <h3>{reportPage.title}</h3>
                      <p>{reportPage.description}</p>
                    </div>
                  </button>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {page && activePage !== null && (
        <div className="lightbox open" role="dialog" aria-modal="true" aria-label="Informe de ejemplo" aria-hidden="false" onMouseDown={(event) => { if (event.target === event.currentTarget) setActivePage(null); }}>
          <button className="lb-btn lb-close" type="button" aria-label="Cerrar" ref={closeButtonRef} onClick={() => setActivePage(null)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
          </button>
          <button className="lb-btn lb-prev" type="button" aria-label="Página anterior" onClick={() => showPage(activePage - 1)}><ArrowLeft aria-hidden="true" /></button>
          <img src={`/assets/reporte-${activePage}.webp`} alt={`Informe de ejemplo (caso ficticio de Mateo Valdivia): ${page.alt}`} width="708" height="1000" />
          <button className="lb-btn lb-next" type="button" aria-label="Página siguiente" onClick={() => showPage(activePage + 1)}><ArrowRight aria-hidden="true" /></button>
          <p className="lb-cap">{activePage + 1} de {pages.length}. {page.title}. Caso ficticio.</p>
        </div>
      )}
    </>
  );
}
