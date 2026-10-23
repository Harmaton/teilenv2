"use client";

import { GraduationCap, HeartHandshake, UsersRound } from "lucide-react";
import LandingNav from "./nav";
import Reveal from "./reveal";
import EcosystemSection from "./ecosystem-section";
import LandingFooter, { WhatsAppFloat } from "./footer";

const participationOptions = [
  { icon: UsersRound, title: "Afiliados Teilen", className: "t-orange", description: "Adultos que quieren recomendar la plataforma de manera responsable, con un convenio individual y normas de comunicación verificables. Las condiciones económicas no se publican como promesa general.", action: "Postular como afiliado" },
  { icon: CompassIcon, title: "Mentores Teilen", className: "t-violet", description: "Profesionales que disfrutan su trabajo, tienen una vocación que compartir y quieren aportar experiencia en actividades supervisadas con jóvenes. Hoy son 36 mentores autorizados de distintos países, coordinados por Ely Plasencia, Directora de Mentorías.", action: "Postular como mentor" },
  { icon: HeartHandshake, title: "Jóvenes Creadores", className: "t-sun", description: "Participación creativa, comunitaria y no remunerada de adolescentes, con autorización familiar y actividades supervisadas. No es una cuenta de afiliación ni un acceso comercial a otros menores.", action: "Consultar mediante un adulto responsable" },
  { icon: GraduationCap, title: "Representantes institucionales", className: "t-mint", description: "Personas que pueden conectar a Teilen con colegios, editoriales, fundaciones o comunidades educativas, respetando los protocolos correspondientes.", action: "Solicitar una conversación" },
];

const applicationSteps = [
  ["Nos cuentas quién eres", "Tu perfil, tu experiencia y para qué quieres participar, con un enlace público cuando corresponda."],
  ["Hacemos una revisión breve", "Verificamos la pertinencia. Si hay contacto con adolescentes, aplicamos comprobaciones adicionales según la actividad y el país."],
  ["Definimos juntos el alcance", "Responsabilidades, ética de promoción, canal de trabajo, supervisión y acuerdos particulares antes de comenzar."],
];

export default function CommunityPage() {
  return (
    <>
      <LandingNav activePage="/comunidad" />
      <main id="contenido">
        <section className="phero bg-orange dots-ink">
          <div className="wrap"><div className="phero-grid">
            <div><span className="sticker crumb">Comunidad Teilen</span><h1>Un futuro diferente necesita más personas construyéndolo.</h1>
              <p className="lead">Puedes participar desde tu profesión, tu capacidad de comunicar, tu red educativa o tu interés por crear oportunidades para otros. Cada modalidad tiene reglas, responsables y procesos propios.</p>
              <div className="btn-row"><a className="btn btn-ink" href="#postular"><span>Postular ahora</span><span className="ico"><ChevronIcon /></span></a><a className="btn btn-white" href="#modalidades">Ver las modalidades</a></div>
            </div>
            <div className="phero-visual"><div className="cloud" aria-label="Formas de participar"><span>Afiliados</span><span>Mentores</span><span>Jóvenes Creadores</span><span>Representantes</span></div></div>
          </div></div>
        </section>

        <section className="sec bg-paper" id="modalidades">
          <div className="wrap"><Reveal className="head"><h2>Elige desde dónde quieres ser parte.</h2><p className="lead">No buscamos un catálogo de títulos. Nos interesa saber qué haces, por qué disfrutas hacerlo y cómo te gustaría contribuir.</p></Reveal>
            <div className="grid-2 mt-l">{participationOptions.map(({ icon: Icon, title, className, description, action }) => <Reveal key={title}><article className={`tile ${className} lift mod`}><span className="ic"><Icon aria-hidden="true" /></span><h3>{title}</h3><p>{description}</p><p className="mt-s"><a className="text-link" href="#postular">{action}</a></p></article></Reveal>)}</div>
          </div>
        </section>

        <section className="sec bg-white"><div className="wrap"><Reveal className="head"><h2>Nos importa tu motivación, no los trámites innecesarios.</h2></Reveal>
          <div className="steps">{applicationSteps.map(([title, description], index) => <Reveal key={title}><article className="step"><span className="num">{index + 1}</span><h3>{title}</h3><p>{description}</p></article></Reveal>)}</div>
        </div></section>

        <section className="sec bg-ink dots" id="postular"><div className="wrap"><div className="split top">
          <Reveal className="stack-lg"><div><h2>Cuéntanos cómo te gustaría participar.</h2><p className="lead">Al enviar, se abre tu aplicación de correo con el mensaje listo. No pedimos documentos de identidad, respuestas del test ni información de menores en este formulario.</p></div></Reveal>
          <Reveal><CommunityApplicationForm /></Reveal>
        </div></div></section>
        <EcosystemSection />
      </main>
      <LandingFooter /><WhatsAppFloat />
    </>
  );
}

function CommunityApplicationForm() {
  return (
    <form className="form" action="mailto:talento@teilenteens.com" method="post" encType="text/plain" onSubmit={(event) => {
      event.preventDefault();
      const form = event.currentTarget;
      if (!form.reportValidity()) return;
      const fields = new FormData(form);
      const body = Array.from(fields.entries()).filter(([key]) => key !== "acepto").map(([key, value]) => `${key}: ${String(value)}`).join("\n");
      const subject = encodeURIComponent("Postulación Comunidad Teilen");
      window.location.href = `mailto:talento@teilenteens.com?subject=${subject}&body=${encodeURIComponent(body)}`;
    }}>
      <div className="fgrid">
        <div className="field"><label htmlFor="community-name">Nombre y apellido *</label><input id="community-name" name="nombre" required autoComplete="name" /></div>
        <div className="field"><label htmlFor="community-country">País *</label><input id="community-country" name="pais" required autoComplete="country-name" /></div>
        <div className="field"><label htmlFor="community-email">Correo electrónico *</label><input id="community-email" name="correo" type="email" required autoComplete="email" /></div>
        <div className="field"><label htmlFor="community-type">Modalidad *</label><select id="community-type" name="modalidad" required defaultValue=""><option value="" disabled>Selecciona</option><option>Afiliado adulto</option><option>Mentor profesional voluntario</option><option>Adulto responsable de un joven creador</option><option>Representante institucional</option></select></div>
        <div className="field"><label htmlFor="community-profession">Profesión o actividad (opcional)</label><input id="community-profession" name="profesion" /></div>
        <div className="field"><label htmlFor="community-profile">Perfil profesional público (opcional)</label><input id="community-profile" name="perfil" type="url" placeholder="https://" /></div>
        <div className="field full"><label htmlFor="community-message">¿Qué haces y por qué quieres formar parte? *</label><textarea id="community-message" name="mensaje" required /></div>
        <label className="check"><input type="checkbox" name="acepto" required /><span>Confirmo que soy mayor de edad, o la persona adulta responsable que consulta por un joven, y acepto que se use mi correo para responder esta postulación. No incluyo datos personales de menores.</span></label>
      </div>
      <button type="submit" className="btn btn-primary btn-full"><span>Preparar mi postulación por correo</span><span className="ico"><ArrowIcon /></span></button>
    </form>
  );
}

function CompassIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5z" /></svg>;
}
function ChevronIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>;
}
function ArrowIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7" /><path d="M8 7h9v9" /></svg>;
}
