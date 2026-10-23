import { ShieldCheck } from "lucide-react";
import LandingNav from "./nav";
import Reveal from "./reveal";
import EcosystemSection from "./ecosystem-section";
import LandingFooter, { WhatsAppFloat } from "./footer";

export default function MecenasPage() {
  const email = "mailto:talento@teilenteens.com?subject=Mecenas%20Teilen%3A%20solicitud%20de%20reuni%C3%B3n";
  return (
    <>
      <LandingNav activePage="/mecenas" />
      <main id="contenido">
        <section className="phero bg-sun dots-ink"><div className="wrap"><div className="phero-grid">
          <div><span className="sticker crumb">Impacto educativo y social</span><h1>Que el acceso al talento no dependa del ingreso familiar.</h1><p className="lead">Mecenas Teilen reúne a empresas y benefactores que quieren financiar participaciones en Werden, el programa de entrenamiento de Teilen, para estudiantes que no podrían cubrir su acceso de forma privada. Quienes lo hacen son nuestros Embajadores de Talento.</p><div className="btn-row"><a className="btn btn-ink" href={email}><span>Solicitar una reunión</span><span className="ico"><MailIcon /></span></a><a className="btn btn-white" href="https://werden.vercel.app/" target="_blank" rel="noopener noreferrer">Conocer Werden</a></div></div>
          <div className="phero-visual"><figure className="photo" style={{ margin: 0 }}><img src="/assets/editorial-1.webp" alt="Estudiantes trabajando juntos con computadoras portátiles" loading="lazy" /><span className="lbl">Imagen ilustrativa</span></figure></div>
        </div></div></section>
        <section className="sec bg-white"><div className="wrap"><Reveal className="head"><h2>Una donación que permite un proceso, no un evento.</h2><p className="lead">El alcance se define con la Fundación Simple Life: condiciones de selección, autorización familiar, participación y seguimiento. No publicamos niveles económicos cerrados porque cada alianza requiere un convenio específico.</p></Reveal>
          <div className="steps"><Reveal><article className="step"><span className="num">1</span><h3>Identidad</h3><p>Acceso a Teilen Teens y al mapa de Identidad Evolutiva.</p></article></Reveal><Reveal><article className="step"><span className="num">2</span><h3>Experiencia</h3><p>Entrenamiento de habilidades humanas integradas en retos colectivos.</p></article></Reveal><Reveal><article className="step"><span className="num">3</span><h3>Dirección</h3><p>Construcción inicial del Proyecto de Vida y del perfil humano y profesional.</p></article></Reveal></div>
        </div></section>
        <section className="sec bg-ink dots"><div className="wrap"><Reveal className="split">
          <div className="stack-lg"><h2>El impacto debe poder contarse sin exponer al adolescente.</h2><p className="lead">Los reportes para donantes e instituciones serán agregados y con criterios de protección de datos. No se divulgan respuestas, valores personales, conversaciones con Salomón IA ni perfiles individuales como material comercial.</p></div>
          <div className="callout"><span className="ic"><ShieldCheck aria-hidden="true" /></span><div><p><strong>Documentación fiscal.</strong> La documentación de cada contribución corresponde a la entidad receptora efectivamente habilitada y a la normativa aplicable al benefactor.</p></div></div>
        </Reveal></div></section>
        <section className="sec-s"><div className="wrap"><Reveal><div className="cta-band"><span className="deco" aria-hidden="true" /><span className="deco two" aria-hidden="true" /><h2>¿Representas una empresa o fundación?</h2><p>Podemos estudiar una alianza institucional y definir en una reunión su alcance, responsabilidades y seguimiento.</p><div className="btn-row"><a className="btn btn-ink" href={email}><span>Solicitar una reunión</span><span className="ico"><MailIcon /></span></a><a className="btn btn-line" href="https://wa.me/5493517623874?text=Hola%2C%20represento%20a%20una%20empresa%20o%20fundaci%C3%B3n%20y%20quiero%20conocer%20Mecenas%20Teilen." target="_blank" rel="noopener noreferrer"><span>Escribir por WhatsApp</span><span className="ico"><MessageIcon /></span></a></div></div></Reveal></div></section>
        <EcosystemSection />
      </main>
      <LandingFooter /><WhatsAppFloat />
    </>
  );
}

function MailIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m3.5 6.5 8.5 7 8.5-7" /></svg>; }
function MessageIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 20l1.3-4A8.5 8.5 0 1 1 12 20.5a8.4 8.4 0 0 1-4-1z" /><path d="M9 8.8c0 3.5 2.7 6.2 6.2 6.2l1-1.6-2-1-1 .9a4 4 0 0 1-2.6-2.6l.9-1-1-2z" /></svg>; }
