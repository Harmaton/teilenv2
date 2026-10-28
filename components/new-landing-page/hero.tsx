"use client";

import { ArrowUpRight, Clock3, FileText } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const possibilities = [
  "crear lo que no existe",
  "ordenar el caos",
  "explicar lo difícil",
  "cuidar a otros",
  "liderar sin gritar",
];

export default function LandingHero() {
  const [possibilityIndex, setPossibilityIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPossibilityIndex((current) => (current + 1) % possibilities.length);
    }, 3200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="hero bg-ink dots glow-host">
      <div className="spot" aria-hidden="true" />
      <div className="hero-deco" aria-hidden="true">
        <span className="blob b1" /><span className="blob b2" /><span className="blob b3" />
        <span className="fchip c1 sun"><i />Creativa</span>
        <span className="fchip c2 lilac"><i />Líder</span>
        <span className="fchip c3 mint"><i />Curioso</span>
        <span className="fchip c4 orange"><i />Empática</span>
        <span className="fchip c5 white"><i />Estratega</span>
        <span className="fchip c6 lilac"><i />Inventor</span>
      </div>
      <div className="wrap hero-grid">
        <div>
          <span className="sticker sun"><Clock3 aria-hidden="true" /> 5 minutos, sin tarjeta</span>
          <h1>¿Para qué eres <span className="hl-draw">bueno?<Underline /></span></h1>
          <p className="rot-line"><span>Quizás para</span><span className="rot"><span className="rot-word" key={possibilityIndex}>{possibilities[possibilityIndex]}</span></span></p>
          <p className="lead" style={{ marginTop: 22 }}>
            Descúbrelo en 5 minutos. Antes de que alguien decida por ti qué estudiar, Teilen te muestra tus habilidades predominantes, cómo aprendes, qué valores te mueven y dónde puedes generar valor.
          </p>
          <div className="btn-row" style={{ marginTop: 22 }}>
            <Link className="btn btn-primary" href="/tests">
              <span>Empieza sin pagar</span><span className="ico"><ArrowUpRight aria-hidden="true" /></span>
            </Link>
            <a className="btn btn-line" href="#ejemplo">Ver un informe de ejemplo</a>
          </div>
          <p className="hero-note">
            Sin tarjeta para empezar. Si quieres tu informe completo de 5 páginas y 5 preguntas a Salomón IA: USD 50, o 60% menos con tu código de lanzamiento hasta el 31 de diciembre de 2026. Desde los 13 años; entre 13 y 17, con autorización de una persona adulta responsable.
          </p>
        </div>
        <div className="map" aria-label="Vista previa del mapa de Identidad Evolutiva">
          <div className="map-orbit o1" /><div className="map-orbit o2" />
          <span className="node v n1"><i /></span>
          <span className="node s n2"><i /></span>
          <span className="node n3"><i /></span>
          <span className="node v n4"><i /></span>
          <div className="map-paper">
            <img src="/assets/reporte-0.webp" alt="Portada de un informe ficticio de Identidad Evolutiva" width="708" height="1000" fetchPriority="high" />
          </div>
          <div className="float timer">
            <div className="timer-row"><span>Tu evaluación</span><strong>≈ 5 min</strong></div>
            <div className="bar"><span /></div>
          </div>
          <div className="float chat">
            <div className="who"><span className="avatar-ia">S</span><span>Salomón IA</span></div>
            <p>¿Cómo pruebo esta habilidad esta semana?</p>
            <span className="typing" aria-hidden="true"><i /><i /><i /></span>
          </div>
          <span className="pill"><FileText aria-hidden="true" /> 5 páginas</span>
        </div>
      </div>
    </section>
  );
}

function Underline() {
  return <svg viewBox="0 0 300 34" preserveAspectRatio="none" aria-hidden="true"><path d="M5 25 C 70 8, 150 6, 295 17" /></svg>;
}
