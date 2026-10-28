import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import Reveal from "./reveal";
import { experiences } from "./experience-data";

const faqs = [
  ["¿Teilen me dice qué carrera tengo que estudiar?", "No. El informe te muestra cómo funcionas hoy y cuatro escenarios para explorar. La decisión sigue siendo tuya."],
  ["¿Tengo que pagar antes de responder?", "No. Empiezas sin tarjeta. Desbloquear el informe completo con cinco preguntas a Salomón IA cuesta USD 50."],
  ["¿Hay algún descuento?", "Sí. Hasta el 31 de diciembre de 2026, con tu código de lanzamiento pagas USD 20 en lugar de USD 50. Pídelo por WhatsApp en la sección de precio."],
  ["¿Qué pasa si tengo menos de 18 años?", "Teilen está disponible desde los 13 años. Entre los 13 y 17, una persona adulta responsable autoriza antes de que respondas y tú aceptas participar. Las reglas pueden variar según tu país."],
  ["¿La IA decide mi talento?", "No. El motor metodológico calcula los resultados. La IA los traduce a un informe claro y visual, y Salomón IA te ayuda a conversarlos."],
  ["¿Mis respuestas se comparten con mi colegio o con otras personas?", "No se entregan automáticamente a colegios, empresas ni a otras personas. El mensaje para tu familia no incluye tus respuestas."],
  ["¿Tengo acompañamiento humano o solo la IA?", "Además de Salomón IA, puedes contar con una red de 36 mentores autorizados, de distintos países y profesiones, coordinada por Ely Plasencia, Directora de Mentorías."],
  ["¿Qué pasa después del informe?", "Puedes seguir con Werden, un programa de entrenamiento de seis meses: cinco proyectos reales en equipo y, al final, tu primer manifiesto y tu primer perfil profesional."],
  ["¿Reemplaza a un psicólogo, docente u orientador?", "No. Es una herramienta de autoconocimiento y exploración. No es una evaluación clínica ni sustituye el acompañamiento de profesionales."],
];

export function HomePriceSection() {
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
                <span className="sticker">Pago único</span>
                <div className="ticket-price"><small>USD</small><b>50</b></div>
                <h3>Identidad Evolutiva completa</h3>
                <p className="small" style={{ color: "var(--muted)", marginTop: 8 }}>La moneda local, los impuestos y la garantía se muestran antes de pagar. <Link className="text-link" href="/precio">Ver precio y condiciones</Link></p>
                <aside className="promo" aria-label="Oferta de lanzamiento">
                  <span className="promo-badge" aria-hidden="true"><b>-60%</b></span>
                  <div className="promo-t">
                    <b>Código de lanzamiento</b>
                    <span>Paga <strong>USD 20</strong> en lugar de USD 50. Válido hasta el 31 de diciembre de 2026.</span>
                  </div>
                  <a className="btn btn-ink btn-sm" href="https://wa.me/5493517623874?text=Hola%2C%20quiero%20mi%20c%C3%B3digo%20de%20lanzamiento%20de%20Teilen%20Teens." target="_blank" rel="noopener noreferrer">Quiero mi código</a>
                </aside>
              </div>
              <div className="ticket-cut" />
              <div className="ticket-bot">
                <ul className="checks">
                  <li><span>Informe visual personalizado de 5 páginas, en PDF</span></li>
                  <li><span>Tu mapa de talento, fortalezas, aprendizaje, valores y patrones</span></li>
                  <li><span>Cuatro escenarios de valor y orientación para tu Proyecto de Vida</span></li>
                  <li><span>5 preguntas a Salomón IA dentro de la plataforma</span></li>
                </ul>
                <div className="mt-m"><Link className="btn btn-primary btn-full" href="/tests"><span>Empieza sin pagar</span><span className="ico"><ArrowIcon /></span></Link></div>
                <p className="tiny" style={{ marginTop: 14 }}>Primero respondes. El pago llega después, solo si quieres tu informe.</p>
              </div>
            </article>
          </Reveal>
          <Reveal className="stack-lg">
            <div>
              <h3 className="h2" style={{ fontSize: "clamp(1.8rem,3vw,2.5rem)" }}>¿Lo paga alguien de tu familia?</h3>
              <p className="lead" style={{ marginTop: 12 }}>Mándale un mensaje con todo explicado. No incluye tus respuestas ni tus resultados.</p>
              <div className="phone" aria-label="Ejemplo de mensaje para compartir con tu familia">
                <div className="phone-screen">
                  <div className="phone-bar"><span className="av">F</span><div><strong>Familia</strong><span>en línea</span></div></div>
                  <div className="phone-body">
                    <div className="msg me">Encontré Teilen Teens. Respondo en unos 5 minutos sin tarjeta. El informe completo con 5 preguntas a Salomón IA cuesta USD 50. ¿Lo vemos juntos?<span className="meta">18:42</span></div>
                    <div className="msg them">Dale, lo vemos esta noche.<span className="meta">18:45</span></div>
                  </div>
                </div>
              </div>
              <a className="btn btn-ink mt-m" href="https://wa.me/?text=Encontr%C3%A9%20Teilen%20Teens.%20Respondo%20en%20unos%205%20minutos%20sin%20tarjeta.%20El%20informe%20completo%20cuesta%20USD%2050.%20%C2%BFLo%20vemos%20juntos%3F" target="_blank" rel="noopener noreferrer">Enviar a mi familia</a>
              <aside className="minor-note mt-m" aria-label="Autorización para adolescentes">
                <span className="ic"><LockKeyhole aria-hidden="true" /></span>
                <div>
                  <strong>Si tienes entre 13 y 17 años</strong>
                  <p>Una persona adulta responsable autoriza antes de que respondas. El pago queda asociado a tu evaluación dentro de la plataforma.</p>
                  <Link className="text-link" href="/menores">Conoce el proceso para menores</Link>
                </div>
              </aside>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function HomeMentorSection() {
  return (
    <section className="sec bg-sun dots-ink">
      <div className="wrap mentor">
        <Reveal className="stack-lg">
          <span className="sticker violet">Acompañamiento humano</span>
          <h2>Una IA que te responde. Personas que te acompañan.</h2>
          <p className="lead">Además de Salomón IA, en Teilen puedes acceder a mentoría humana: una red de personas autorizadas de distintos países y profesiones.</p>
          <div className="btn-row">
            <Link className="btn btn-ink" href="/comunidad">Conocer la comunidad</Link>
            <Link className="text-link" href="/experiencias">Leer experiencias</Link>
          </div>
        </Reveal>
        <Reveal>
          <div className="ely">
            <figure className="ely-photo"><img src="/assets/ely-plasencia.webp" alt="Retrato de Ely Plasencia, Directora de Mentorías de Teilen" width="720" height="1118" loading="lazy" /></figure>
            <div className="ely-badge" aria-label="36 mentores autorizados"><b>36</b><span>mentores<br />autorizados</span></div>
            <div className="ely-card">
              <span className="sticker orange">Directora de Mentorías</span>
              <h3>Ely Plasencia</h3>
              <p>Lidera la red de mentores autorizados que acompañan a quienes hacen Teilen.</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function HomeComparisonSection() {
  return (
    <section className="sec bg-white">
      <div className="wrap">
        <Reveal className="head">
          <h2>¿En qué se diferencia de otras formas de orientarte?</h2>
          <p className="lead">Cada opción responde una pregunta distinta. Teilen responde la primera: quién eres y hacia dónde mirar.</p>
        </Reveal>
        <div className="compare-wrap" role="region" aria-label="Comparación de herramientas de orientación" tabIndex={0}>
          <table className="compare">
            <thead><tr><th scope="col"><span className="sr-only">Aspecto</span></th><th scope="col">Test gratis online</th><th scope="col">Orientación tradicional</th><th scope="col">Charla con un profesional</th><th scope="col" className="tt">Teilen Teens</th></tr></thead>
            <tbody>
              <tr><th scope="row">Qué te muestra</th><td>Un tipo o una etiqueta</td><td>Intereses y carreras</td><td>Cómo es una carrera por dentro</td><td className="tt">Quién eres: talentos, valores, cómo aprendes y cuatro escenarios</td></tr>
              <tr><th scope="row">Tiempo</th><td>Minutos</td><td>Varias sesiones</td><td>Una charla por carrera</td><td className="tt">≈ 5 minutos, y Salomón IA después</td></tr>
              <tr><th scope="row">Alcance</th><td>Personalidad</td><td>Carreras</td><td>Una carrera por charla</td><td className="tt">Estudios, profesiones emergentes, emprendimiento y entorno de trabajo</td></tr>
              <tr><th scope="row">Seguimiento</th><td>No</td><td>Según el profesional</td><td>No</td><td className="tt">Salomón IA con tu informe</td></tr>
              <tr><th scope="row">Costo</th><td>Gratis</td><td>Por sesión</td><td>Por charla</td><td className="tt">USD 50, una vez</td></tr>
            </tbody>
          </table>
        </div>
        <p className="tiny mt-m">Esta comparación es orientativa: las herramientas, profesionales y servicios pueden variar.</p>
      </div>
    </section>
  );
}

export function HomeHistorySection() {
  return (
    <section className="sec bg-ink dots">
      <div className="wrap evo" data-state="hoy">
        <Reveal>
          <h2>De dos horas y media a cinco minutos.</h2>
          <p className="lead" style={{ marginTop: 18 }}>Teilen no nació como un test hecho con IA. Viene de años de trabajo con personas y organizaciones, y de muchas versiones que fueron quitando lo que sobraba.</p>
          <p className="tiny mt-m">Más de 17.000 participaciones históricas, de distintas edades y versiones del sistema. No equivalen a clientes ni a un estudio independiente de validación.</p>
        </Reveal>
        <div className="evo-cards">
          <div className="evo-card"><div className="evo-val"><span>5 min</span></div><p>para responder la evaluación; las primeras versiones tomaban 2 h 30</p></div>
          <div className="evo-card"><div className="evo-val"><span>5</span></div><p>páginas de informe; antes eran 107</p></div>
          <div className="evo-card wide"><div className="evo-val"><span>17.000+</span></div><p>participaciones históricas durante el desarrollo</p></div>
        </div>
      </div>
    </section>
  );
}

export function HomeTestimonialsSection() {
  const testimonials = experiences.slice(0, 3);

  return (
    <section className="sec bg-paper">
      <div className="wrap">
        <Reveal className="head">
          <h2>No tienes que creernos. Escucha a quienes lo usaron.</h2>
          <p className="lead">Madres, padres, educadores y profesionales comparten sus experiencias. Son percepciones personales, no una validación científica.</p>
        </Reveal>
        <div className="grid-3">
          {testimonials.map((experience) => (
            <Reveal key={experience.name}>
              <article className="tile lift">
                <blockquote><p>“{experience.quote}”</p></blockquote>
                <p className="role">{experience.name}</p>
                <p>{experience.role} · {experience.location}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <Link className="text-link mt-xl" href="/experiencias">Leer todas las experiencias</Link>
      </div>
    </section>
  );
}

export function HomeTeamSection() {
  const members = [
    { name: "Salomón Boss", role: "Fundador y dirección metodológica", description: "Psicología, filosofía, coaching y desarrollo humano al servicio de una forma distinta de comprender el talento.", image: "/assets/salomon.webp" },
    { name: "Harmaton Njagi", role: "Ingeniería y plataforma", description: "Desarrollo técnico, implementación de la experiencia digital y evolución tecnológica de Teilen.", image: "/assets/harmaton.webp" },
    { name: "Pietro Moura", role: "Investigación y metodología", description: "Revisión de fundamentos y consistencia de la arquitectura interpretativa del proyecto.", image: "/assets/pietro.webp" },
  ];

  return (
    <section className="sec bg-white">
      <div className="wrap">
        <Reveal className="head">
          <h2>Detrás de Teilen hay personas.</h2>
          <p className="lead">Metodología, investigación y tecnología conversando para convertir información compleja en algo útil.</p>
        </Reveal>
        <div className="team">
          {members.map((member) => (
            <Reveal key={member.name}>
              <article className="member">
                <figure><img src={member.image} alt={`Retrato de ${member.name}`} width="720" height="900" loading="lazy" /></figure>
                <h3>{member.name}</h3>
                <p className="role">{member.role}</p>
                <p>{member.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <div className="mt-xl"><Link className="text-link" href="/nosotros">Conocer al equipo y la historia</Link></div>
      </div>
    </section>
  );
}

export function HomeWerdenSection() {
  return (
    <section className="sec bg-ink dots" id="werden">
      <div className="wrap">
        <div className="bridge">
          <Reveal className="stack-lg">
            <span className="sticker">Después de Teilen</span>
            <h2>Descubrir es el comienzo. Entrenar cambia la historia.</h2>
            <p className="lead">Werden es un programa de entrenamiento de seis meses que convierte el autoconocimiento en proyectos, práctica y próximos pasos.</p>
            <div className="prog">
              <div><b>Comprender</b><span>Mes 1 · con Teilen</span></div>
              <div><b>Entrenar</b><span>Meses 2 a 5 · cinco mundos reales</span></div>
              <div><b>Construir</b><span>Mes 6 · tu manifiesto</span></div>
            </div>
            <p className="small" style={{ color: "var(--muted-on-ink)" }}><strong style={{ color: "var(--white)" }}>USD 520.</strong> Incluye Teilen Teens, la Identidad Evolutiva y cinco preguntas a Salomón IA.</p>
            <Link className="btn btn-primary" href="https://werden.vercel.app/" target="_blank" rel="noopener noreferrer">Conocer Werden</Link>
          </Reveal>
          <Reveal>
            <div className="bridge-visual" aria-label="Teilen como punto de partida para el programa Werden">
              <div className="bv-card bv-t"><img src="/assets/teilen-logo.png" alt="Teilen" loading="lazy" /><b>Teilen</b><span>Dividir para entender</span><small>Talentos, valores y cómo aprendes.</small></div>
              <div className="bv-card bv-w"><b>Werden</b><span>Entrenar para construir</span><small>Proyectos reales, práctica y propósito.</small></div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function HomeFaqSection() {
  return (
    <section className="sec bg-white" id="faq">
      <div className="wrap narrow">
        <Reveal className="head"><h2>Preguntas que vale la pena responder.</h2></Reveal>
        <div className="faq">
          {faqs.map(([question, answer]) => (
            <details key={question}>
              <summary>{question}<span className="pm" aria-hidden="true"><PlusIcon /></span></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7" /><path d="M8 7h9v9" /></svg>;
}

function PlusIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>;
}
