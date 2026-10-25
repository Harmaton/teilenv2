"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Brain, Heart, Lightbulb, NotebookTabs, Target } from "lucide-react";
import LandingNav from "./nav";
import Reveal from "./reveal";
import EcosystemSection from "./ecosystem-section";
import LandingFooter, { WhatsAppFloat } from "./footer";

const dimensions = [
  [Lightbulb, "Capacidades predominantes", "Observamos las áreas con mayor peso en el perfil técnico y cómo pueden expresarse en situaciones cotidianas."],
  [Heart, "Fortalezas", "Identificamos rasgos elegidos por el participante que pueden conectarse con acciones y oportunidades de desarrollo."],
  [Target, "Valores", "Trabajamos criterios personales que pueden orientar decisiones. Algunas respuestas exigen medidas reforzadas de protección de datos."],
  [BookOpen, "Aprendizaje", "Interpretamos condiciones, preferencias y patrones que pueden facilitar la comprensión y la experiencia práctica."],
  [Brain, "Decisiones y sesgos", "Proponemos hipótesis de observación sobre lo que puede ayudar o limitar la claridad al elegir."],
  [NotebookTabs, "Escenarios de futuro", "Traducimos el perfil en alternativas de exploración y preguntas para construir un proyecto de vida."],
] as const;

export default function MethodologyPage() {
  const [version, setVersion] = useState<"antes" | "hoy">("antes");
  return (
    <>
      <LandingNav activePage="/metodologia" />
      <main id="contenido">
        <MethodologyHero />
        <MethodDimensions />
        <MethodEvolution version={version} setVersion={setVersion} />
        <MethodPrinciple />
        <MethodCta />
        <EcosystemSection />
      </main>
      <LandingFooter /><WhatsAppFloat />
    </>
  );
}

function MethodologyHero() {
  return (
    <section className="phero bg-paper dots-ink"><div className="wrap"><div className="phero-grid">
      <div><span className="sticker crumb">Nuestro enfoque</span><h1>La ciencia procesa. La IA traduce. La persona decide.</h1><p className="lead">No construimos la evaluación delegando las puntuaciones a un chatbot. Teilen separa el cálculo metodológico de la traducción narrativa y visual del resultado.</p><div className="btn-row"><Link className="btn btn-primary" href="/tests"><span>Empieza sin pagar</span><span className="ico"><ArrowIcon /></span></Link><Link className="btn btn-white" href="/#ejemplo">Ver un informe de ejemplo</Link></div></div>
      <div className="phero-visual"><div className="pipe-panel bg-violet"><h2>Dos tareas diferentes.</h2><div className="pipe" aria-label="Cómo se separan las tareas"><PipeBox title="Motor metodológico" text="Procesa las respuestas y calcula la salida técnica." /><PipeArrow /><PipeBox title="Capa de IA" text="Transforma esa salida en lenguaje claro, integra el relato y ayuda a diagramar la entrega." /><PipeArrow /><PipeBox title="Salomón IA" text="Facilita preguntas y la exploración posterior del informe." /></div></div></div>
    </div></div></section>
  );
}

function MethodDimensions() {
  return (
    <section className="sec bg-white"><div className="wrap"><Reveal className="head"><h2>Una mirada interdisciplinaria, no una etiqueta aislada.</h2><p className="lead">Nuestro marco de interpretación reúne fuentes vinculadas a las neurociencias, la neurobiología, la psicología del comportamiento y la ciencia afectiva. El detalle propietario de los instrumentos y cálculos no se publica.</p></Reveal>
      <div className="grid-3 mt-l">{dimensions.map(([Icon, title, description]) => <Reveal key={title}><article className="tile"><span className="ic"><Icon aria-hidden="true" /></span><h3>{title}</h3><p>{description}</p></article></Reveal>)}</div>
    </div></section>
  );
}

function MethodEvolution({ version, setVersion }: { version: "antes" | "hoy"; setVersion: (version: "antes" | "hoy") => void }) {
  return (
    <section className="sec bg-ink dots"><div className="wrap"><div className="evo" data-state={version}>
      <div><h2>El formato se simplificó. La intención se mantuvo.</h2><p className="lead" style={{ marginTop: 18 }}>La experiencia evolucionó desde evaluaciones de unas dos horas y media, con informes de hasta 107 páginas, hacia una interacción de unos cinco minutos y una entrega visual de cinco páginas.</p>
        <div className="switch" role="group" aria-label="Comparar versiones"><button type="button" data-evo="antes" aria-pressed={version === "antes"} onClick={() => setVersion("antes")}>Primeras versiones</button><button type="button" data-evo="hoy" aria-pressed={version === "hoy"} onClick={() => setVersion("hoy")}>Hoy</button></div>
        <p className="tiny mt-m">Más de 17.000 participaciones históricas, de distintas edades y versiones del sistema. No equivalen a clientes de la versión actual ni a evidencia independiente de validez psicométrica. Los resultados de validación que se publiquen incluirán metodología, muestra y fecha verificables.</p>
      </div>
      <div className="evo-cards"><div className="evo-card"><div className="evo-val"><span className="v-antes">2 h 30</span><span className="v-hoy">5 min</span></div><p>para responder la evaluación</p></div><div className="evo-card"><div className="evo-val"><span className="v-antes">107</span><span className="v-hoy">5</span></div><p>páginas de informe</p></div><div className="evo-card wide"><div className="evo-val"><span className="v-antes">17.000+</span><span className="v-hoy">17.000+</span></div><p>participaciones históricas durante el desarrollo</p></div></div>
    </div></div></section>
  );
}

function MethodPrinciple() {
  return <section className="sec bg-sun"><div className="wrap"><Reveal className="stack-lg"><p className="statement">Un resultado describe un momento. No determina una vida.</p><p className="lead" style={{ color: "var(--ink)", maxWidth: "40em" }}>La Identidad Evolutiva aporta información para construir hipótesis, contrastarlas y seguir aprendiendo. No debe usarse para excluir personas, etiquetar menores, diagnosticar trastornos ni decidir por otros qué pueden llegar a hacer.</p><div className="btn-row"><Link className="btn btn-ink" href="/privacidad"><span>Conocer nuestros principios de privacidad</span><span className="ico"><ArrowIcon /></span></Link></div></Reveal></div></section>;
}

function MethodCta() {
  return <section className="sec-s"><div className="wrap"><Reveal><div className="cta-band"><span className="deco" aria-hidden="true" /><span className="deco two" aria-hidden="true" /><h2>¿Qué podrías descubrir sobre ti?</h2><p>Empieza por comprender tus capacidades. Después decides si quieres desbloquear el informe completo.</p><div className="btn-row"><Link className="btn btn-primary" href="/tests"><span>Empieza sin pagar</span><span className="ico"><ArrowIcon /></span></Link><Link className="btn btn-line" href="/#ejemplo">Ver un informe de ejemplo</Link></div></div></Reveal></div></section>;
}

function PipeBox({ title, text }: { title: string; text: string }) {
  return <div className="pipe-box"><strong>{title}</strong><span>{text}</span></div>;
}
function PipeArrow() {
  return <div className="pipe-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg></div>;
}
function ArrowIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7" /><path d="M8 7h9v9" /></svg>;
}
