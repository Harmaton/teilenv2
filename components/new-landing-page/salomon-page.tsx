import Link from "next/link";
import { Brain, Heart, MessageCircle, Search, Sparkles, Target, UsersRound } from "lucide-react";
import LandingNav from "./nav";
import Reveal from "./reveal";
import EcosystemSection from "./ecosystem-section";
import LandingFooter, { WhatsAppFloat } from "./footer";

const prompts = [
  { icon: Search, title: "Profundizar el perfil", text: "Explícame con un ejemplo cotidiano qué significa esta fortaleza en mi informe." },
  { icon: Target, title: "Contrastar escenarios", text: "¿Qué diferencias encontraría entre emprender y trabajar dentro de una organización?" },
  { icon: Sparkles, title: "Construir dirección", text: "Ayúdame a diseñar una experiencia de dos semanas para observar mejor esta capacidad." },
  { icon: UsersRound, title: "Preparar una conversación", text: "¿Qué preguntas puedo llevarle a un profesional que trabaje en esta área?" },
  { icon: Brain, title: "Entender patrones", text: "¿Cómo puedo darme cuenta de que estoy decidiendo de manera impulsiva?" },
  { icon: Heart, title: "Conversar en familia", text: "¿Cómo les explico a mis padres lo que descubrí y lo que quiero explorar?" },
];

export default function SalomonPage() {
  return (
    <>
      <LandingNav activePage="/salomon-ia" />
      <main id="contenido">
        <SalomonHero />
        <PromptSection />
        <MentorshipSection />
        <MethodSection />
        <ResponsibleUse />
        <SalomonCta />
        <EcosystemSection />
      </main>
      <LandingFooter />
      <WhatsAppFloat />
    </>
  );
}

function SalomonHero() {
  return (
    <section className="phero bg-violet dots">
      <div className="wrap">
        <div className="phero-grid">
          <div>
            <span className="sticker crumb">Dentro de Teilen, no en WhatsApp</span>
            <h1>Lee tu informe. Conversa con él.</h1>
            <p className="lead">Salomón IA aparece junto a tu Identidad Evolutiva para explicar la información, profundizar preguntas y diseñar experimentos que puedas probar fuera de la pantalla. Tu compra incluye cinco preguntas.</p>
            <div className="btn-row">
              <Link className="btn btn-primary" href="/tests"><span>Empieza sin pagar</span><span className="ico"><ArrowIcon /></span></Link>
              <Link className="btn btn-line" href="/#ejemplo">Ver un informe de ejemplo</Link>
            </div>
          </div>
          <Reveal className="phero-visual">
            <div className="chat">
              <div className="chat-head"><span className="avatar-ia">S</span><div><strong>Salomón IA</strong><span>Demostración</span></div></div>
              <div className="chat-body">
                <div className="msg me">¿Cómo puedo comprobar que mi habilidad predominante funciona en la práctica?</div>
                <div className="msg them ia">Convirtámosla en una experiencia: elige un problema de tu entorno, describe cómo intentarías resolverlo y contrasta tu respuesta con alguien que conozca ese contexto. Luego revisamos juntos qué observaste.</div>
              </div>
              <div className="chat-foot"><span>Explícame esta fortaleza con un ejemplo</span><span>¿Qué le pregunto a un profesional?</span></div>
              <p className="chat-note">Ejemplo ficticio de conversación.</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function PromptSection() {
  return (
    <section className="sec bg-paper">
      <div className="wrap">
        <Reveal className="head">
          <h2>Más que recibir respuestas: aprender a hacer mejores preguntas.</h2>
          <p className="lead">Cinco preguntas bien usadas pueden convertir tu informe en un plan. Estas son algunas formas de aprovecharlas.</p>
        </Reveal>
        <div className="prompts">
          {prompts.map(({ icon: Icon, title, text }) => (
            <Reveal key={title}>
              <article className="prompt">
                <h3><Icon aria-hidden="true" />{title}</h3>
                <p className="msg">{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function MentorshipSection() {
  return (
    <section className="sec bg-sun dots-ink" id="mentorias">
      <div className="wrap">
        <Reveal className="mentor-mini">
          <figure className="ely-photo"><img src="/assets/ely-plasencia.webp" alt="Retrato de Ely Plasencia, Directora de Mentorías de Teilen" loading="lazy" width="720" height="1118" /></figure>
          <div className="stack-lg">
            <span className="sticker orange">Además de la IA</span>
            <h2>Detrás de Salomón IA hay personas.</h2>
            <p className="lead">En Teilen, todos tienen mentoría. Una red de 36 mentores humanos autorizados, de distintos países y profesiones, te ayuda a encontrar tu esencia y a decidir con información científica y real. La coordina Ely Plasencia, Directora de Mentorías.</p>
            <div className="btn-row">
              <a className="btn btn-ink" href="https://wa.me/5493517623874?text=Hola%2C%20quiero%20saber%20c%C3%B3mo%20funcionan%20las%20mentor%C3%ADas%20de%20Teilen." target="_blank" rel="noopener noreferrer"><span>Quiero mi mentoría</span><span className="ico"><MessageCircle aria-hidden="true" /></span></a>
              <Link className="text-link" href="/#mentorias">Conocer las mentorías</Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function MethodSection() {
  return (
    <section className="sec bg-ink dots">
      <div className="wrap">
        <Reveal className="split">
          <div className="stack-lg">
            <h2>Los resultados no los inventa la IA.</h2>
            <p className="lead">El motor metodológico procesa tus respuestas y produce resultados técnicos. Una capa de inteligencia artificial expresa esa salida en lenguaje claro y ayuda a presentarla. Salomón IA te deja profundizar después, sin alterar el cálculo original.</p>
            <div className="btn-row"><Link className="btn btn-white" href="/metodologia"><span>Conocer la metodología</span><span className="ico"><ArrowIcon /></span></Link></div>
          </div>
          <div className="pipe" aria-label="Cómo trabaja el sistema" style={{ margin: "0 auto" }}>
            <div className="pipe-box"><strong>El motor calcula</strong><span>Procesa tus respuestas con su propia lógica de evaluación.</span></div>
            <div className="pipe-arrow"><ArrowIcon /></div>
            <div className="pipe-box"><strong>La IA traduce</strong><span>Convierte el resultado técnico en un informe claro. No cambia puntuaciones.</span></div>
            <div className="pipe-arrow"><ArrowIcon /></div>
            <div className="pipe-box hi"><strong>Tú conversas</strong><span>Salomón IA responde sobre tu propio informe.</span></div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ResponsibleUse() {
  return (
    <section className="sec-s bg-white">
      <div className="wrap">
        <Reveal>
          <div className="callout">
            <span className="ic"><ShieldIcon /></span>
            <div>
              <p><strong>Uso responsable.</strong> Salomón IA no sustituye la atención clínica, la atención ante una crisis ni la conversación con personas que conocen una profesión de primera mano. Sus simulaciones son ejercicios orientativos que conviene contrastar con fuentes y experiencias reales.</p>
              <p><Link className="text-link" href="/aviso-ia">Leer el aviso de inteligencia artificial</Link></p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function SalomonCta() {
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

function ShieldIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6z" /><path d="m8.5 12 2.5 2.5 4.5-5" /></svg>;
}
