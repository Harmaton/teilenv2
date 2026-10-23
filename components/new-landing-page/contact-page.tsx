"use client";

import { type FormEvent } from "react";
import { Mail, MessageCircle } from "lucide-react";
import LandingNav from "./nav";
import Reveal from "./reveal";
import EcosystemSection from "./ecosystem-section";
import LandingFooter, { WhatsAppFloat } from "./footer";

export default function ContactPage() {
  return (
    <>
      <LandingNav activePage="/contacto" />
      <main id="contenido">
        <section className="phero bg-ink dots"><div className="wrap"><Reveal>
          <span className="sticker crumb">Queremos conversar</span><h1>El siguiente paso empieza con una pregunta.</h1>
          <p className="lead" style={{ marginTop: "1.4rem" }}>Si representas a una institución, quieres conocer el programa, explorar una alianza o necesitas ayuda con la plataforma, escríbele directamente al equipo de Teilen.</p>
          <div className="btn-row" style={{ marginTop: "1.8rem" }}><a className="btn btn-primary" href="mailto:talento@teilenteens.com"><span>Escribir un correo</span><span className="ico"><Mail aria-hidden="true" /></span></a><a className="btn btn-line" href="https://wa.me/5493517623874?text=Hola%2C%20quisiera%20conocer%20Teilen%20Teens." target="_blank" rel="noopener noreferrer"><span>Hablar por WhatsApp</span><span className="ico"><MessageCircle aria-hidden="true" /></span></a></div>
        </Reveal></div></section>
        <section className="sec bg-paper"><div className="wrap"><div className="split top">
          <Reveal className="stack-lg"><div><h2>Canales oficiales</h2>
            <div className="contact-cards">
              <a className="ccard" href="mailto:talento@teilenteens.com"><span className="ch-ic"><Mail aria-hidden="true" /></span><div><strong>Correo</strong><span>talento@teilenteens.com</span></div></a>
              <a className="ccard" href="https://wa.me/5493517623874?text=Hola%2C%20quisiera%20conocer%20Teilen%20Teens." target="_blank" rel="noopener noreferrer"><span className="ch-ic"><MessageCircle aria-hidden="true" /></span><div><strong>WhatsApp</strong><span>+54 9 3517 62-3874</span></div></a>
              <div className="ccard"><span className="ch-ic"><MapIcon /></span><div><strong>Contacto</strong><span>Salomón Boss, Córdoba, Argentina</span></div></div>
              <a className="ccard" href="https://www.instagram.com/teilenteens/" target="_blank" rel="noopener noreferrer"><span className="ch-ic"><InstagramIcon /></span><div><strong>Instagram</strong><span>@teilenteens</span></div></a>
            </div>
            <p className="tiny">¿Tienes una pregunta sobre tu compra? Escríbenos desde el correo con el que te registraste.</p>
          </div></Reveal>
          <Reveal className="stack"><div><h2>Cuéntanos qué necesitas.</h2><ContactForm /></div></Reveal>
        </div></div></section>
        <EcosystemSection />
      </main>
      <LandingFooter /><WhatsAppFloat />
    </>
  );
}

function ContactForm() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const body = Array.from(data.entries()).filter(([key]) => key !== "acepto").map(([key, value]) => `${key}: ${String(value)}`).join("\n");
    window.location.href = `mailto:talento@teilenteens.com?subject=${encodeURIComponent("Solicitud de información")}&body=${encodeURIComponent(body)}`;
  };
  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="fgrid">
        <div className="field"><label htmlFor="contact-name">Nombre completo *</label><input id="contact-name" name="nombre" required autoComplete="name" /></div>
        <div className="field"><label htmlFor="contact-email">Correo electrónico *</label><input id="contact-email" name="correo" type="email" required autoComplete="email" /></div>
        <div className="field"><label htmlFor="contact-country">País *</label><input id="contact-country" name="pais" required autoComplete="country-name" /></div>
        <div className="field"><label htmlFor="contact-reason">Motivo *</label><select id="contact-reason" name="motivo" required defaultValue=""><option value="" disabled>Selecciona</option><option>Consulta sobre la evaluación</option><option>Institución educativa o colegio</option><option>Editorial o fundación</option><option>Programa Werden</option><option>Embajadores de Talento (becas)</option><option>Mentorías</option><option>Mecenas o empresa donante</option><option>Soporte de compra</option><option>Prensa o colaboración</option><option>Otro</option></select></div>
        <div className="field full"><label htmlFor="contact-organization">Institución u organización (opcional)</label><input id="contact-organization" name="institucion" autoComplete="organization" /></div>
        <div className="field full"><label htmlFor="contact-message">Mensaje *</label><textarea id="contact-message" name="mensaje" required /></div>
        <label className="check"><input type="checkbox" name="acepto" required /><span>Acepto que se use este correo con mis datos de contacto y el mensaje anterior. No incluiré información sensible ni resultados individuales de otras personas.</span></label>
      </div>
      <button type="submit" className="btn btn-primary btn-full"><span>Preparar mi mensaje por correo</span><span className="ico"><ArrowIcon /></span></button>
    </form>
  );
}

function MapIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 4-6 2.5v13L9 17l6 2.5 6-2.5v-13L15 6.5z" /><path d="M9 4v13M15 6.5v13" /></svg>;
}
function InstagramIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r=".6" fill="currentColor" /></svg>;
}
function ArrowIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7" /><path d="M8 7h9v9" /></svg>;
}
