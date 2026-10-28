import { ArrowUpRight, GraduationCap, HeartHandshake, School, Sparkles } from "lucide-react";
import Link from "next/link";
import Reveal from "./reveal";

const audiences = [
  {
    title: "Estoy terminando el colegio",
    description: "Me preguntan qué voy a hacer, pero todavía estoy descubriendo en qué soy bueno.",
    href: "/jovenes",
    icon: Sparkles,
    action: "Este espacio es para ti",
  },
  {
    title: "Soy madre o padre",
    description: "Quiero acompañar su futuro, sin terminar eligiendo por él.",
    href: "/familias",
    icon: HeartHandshake,
    action: "Acompáñalo con más claridad",
  },
  {
    title: "Doy clases",
    description: "Quiero comprender mejor cómo aprende cada estudiante y qué puede potenciar.",
    href: "/colegios",
    icon: GraduationCap,
    action: "Conoce Teilen para educadores",
  },
  {
    title: "Represento un colegio",
    description: "Busco una herramienta de orientación que no etiquete ni cree rankings.",
    href: "/colegios",
    icon: School,
    action: "Explora la propuesta educativa",
  },
];

export default function HomeAudienceSection() {
  return (
    <section className="sec bg-paper">
      <div className="wrap">
        <div className="split">
          <Reveal className="stack-lg">
            <h2>Lo que las empresas intentan arreglar a los 40, se puede ver a los 16.</h2>
            <p className="lead">Teilen nació de una pregunta: ¿por qué esperar a llegar a una empresa para comprender cómo funcionas?</p>
            <Link className="text-link" href="/nosotros">Cómo nació Teilen</Link>
          </Reveal>
          <Reveal>
            <aside className="stat-card">
              <div className="stat-big">39%</div>
              <p>de los estudiantes de 15 años de los países de la OCDE no sabe qué trabajo espera tener a los 30. Es la cifra más alta registrada.</p>
              <p className="tiny">OCDE, <a className="text-link" href="https://www.oecd.org/en/publications/the-state-of-global-teenage-career-preparation_d5f8e3f2-en.html" target="_blank" rel="noopener noreferrer">The State of Global Teenage Career Preparation</a> (2025), con datos de PISA 2022. Es un promedio OCDE; no mide a Argentina ni a usuarios de Teilen.</p>
            </aside>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function HomeAudiencePaths() {
  return (
    <section className="sec bg-ink dots glow-host">
      <div className="wrap">
        <Reveal className="head"><h2>Elige desde dónde llegas.</h2></Reveal>
        <div className="voices">
          {audiences.map(({ title, description, href, icon: Icon, action }, index) => (
            <Reveal key={title}>
              <Link className={`voice ${index % 2 === 0 ? "v1" : "v2"}`} href={href}>
                <span className="who"><Icon aria-hidden="true" /> {title}</span>
                <q>{description}</q>
                <span className="go">{action}<span className="ico"><ArrowUpRight aria-hidden="true" /></span></span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeKineticSections() {
  const firstLine = ["¿En qué eres buena?", "¿En qué eres bueno?", "¿En qué eres buena?", "¿En qué eres bueno?"];
  const secondLine = ["Crear", "Liderar", "Explicar", "Cuidar", "Investigar", "Resolver", "Imaginar", "Conectar"];
  return (
    <>
      <div className="marquee bg-orange" aria-label="Explora tus capacidades">
        <div className="mq-row" aria-hidden="true">
          {["Talentos", "Fortalezas", "Aprendizaje", "Valores", "Posibilidades", "Proyecto de vida"].map((item) => (
            <span className="mq-item mq-q" key={item}>{item}</span>
          ))}
        </div>
      </div>
      <section className="kinetic" aria-label="¿En qué eres buena? ¿En qué eres bueno? Crear, liderar, explicar, cuidar, investigar, resolver, imaginar, conectar.">
        <div className="kt-row" aria-hidden="true">
          {firstLine.map((text, index) => <span className={index % 2 ? "o" : ""} key={`${text}-${index}`}>{text}</span>)}
        </div>
        <div className="kt-row k2" aria-hidden="true">
          {secondLine.map((text, index) => <span className={index % 2 ? "o" : ""} key={text}>{text}</span>)}
        </div>
      </section>
    </>
  );
}

export function HomeAiSection() {
  return (
    <section className="sec bg-violet dots glow-host">
      <div className="wrap">
        <Reveal className="head">
          <h2>Tu informe no termina cuando lo descargas.</h2>
          <p className="lead">Explora lo que dice tu informe, haz preguntas y conversa sobre cómo llevarlo a tu vida.</p>
        </Reveal>
        <div className="isnot">
          <Reveal>
            <article className="tile lift">
              <span className="ic"><Sparkles aria-hidden="true" /></span>
              <h3>Una IA que te responde</h3>
              <p>Haz preguntas sobre tu informe, pide ejemplos y explora distintas maneras de poner tus capacidades en práctica.</p>
              <Link className="text-link" href="/salomon-ia">Conocer Salomón IA</Link>
            </article>
          </Reveal>
          <Reveal>
            <article className="tile lift">
              <span className="ic"><HeartHandshake aria-hidden="true" /></span>
              <h3>El motor calcula. La IA traduce.</h3>
              <p>La inteligencia artificial no inventa tus puntuaciones ni decide tu futuro: ayuda a convertir resultados metodológicos en una explicación clara.</p>
              <Link className="text-link" href="/metodologia">Conocer el método</Link>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
