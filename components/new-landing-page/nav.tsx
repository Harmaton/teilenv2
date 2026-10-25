"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";

const moreLinks = [
  ["Para jóvenes", "Si estás terminando el colegio", "/jovenes"],
  ["Salomón IA", "Conversa con tu informe", "/salomon-ia"],
  ["Experiencias", "Lo que encontraron otras personas", "/experiencias"],
  ["Método", "La ciencia procesa, la IA traduce", "/metodologia"],
  ["Para docentes", "Una clase de tutoría en 45 minutos", "/docentes"],
  ["Werden", "El programa de entrenamiento de 6 meses", "https://werden.vercel.app/"],
  ["Mentorías", "36 mentores humanos, además de la IA", "/#mentorias"],
  ["Comunidad Teilen", "Afiliados, mentores y creadores", "/comunidad"],
  ["Mecenas Teilen", "Sé Embajador de Talento", "/mecenas"],
  ["El Valor Humano", "Newsletter y artículos", "/el-valor-humano"],
  ["Nuestra visión", "Hacia dónde vamos", "/vision"],
  ["Precio", "Qué incluye el informe y cuánto cuesta", "/precio"],
  ["Términos del servicio", "Reglas de uso y condiciones de compra", "/terminos"],
  ["Política de privacidad", "Cómo tratamos tus datos", "/privacidad"],
  ["Política de reembolso", "Cómo solicitar un reembolso", "/reembolsos"],
  ["Centro legal", "Precio y documentos legales", "/legal"],
];

const primaryLinks = [
  ["Cómo funciona", "#pasos"],
  ["Para familias", "/familias"],
  ["Para colegios", "/colegios"],
  ["Nosotros", "/nosotros"],
];

export default function LandingNav({ activePage = "/" }: { activePage?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const darkHeader = ["/", "/colegios", "/nosotros", "/jovenes", "/salomon-ia", "/vision", "/contacto"].includes(activePage);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    const onPointerDown = (event: PointerEvent) => {
      if (!moreRef.current?.contains(event.target as Node)) setMoreOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMoreOpen(false);
        setMobileOpen(false);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("lock", mobileOpen);
    if (!mobileOpen) return;
    const closeButton = document.querySelector<HTMLButtonElement>("[data-menu-close]");
    closeButton?.focus();
    return () => document.body.classList.remove("lock");
  }, [mobileOpen]);

  const closeMobileMenu = () => {
    setMobileOpen(false);
    menuButtonRef.current?.focus();
  };

  return (
    <>
      <a className="skip" href="#contenido">Saltar al contenido</a>
      <header className={`hdr${darkHeader ? " on-ink" : ""}${scrolled ? " scrolled" : ""}`}>
        <div className="wrap hdr-in">
          <Link className="logo" href="/" aria-label="Teilen Teens, inicio">
            <img className="logo-color" src="/assets/teilen-logo.png" alt="Teilen Teens" width="70" height="52" />
            <img className="logo-white" src="/assets/teilen-logo-white.png" alt="" width="70" height="52" />
          </Link>

          <nav className="nav" aria-label="Principal">
            {primaryLinks.map(([label, href], index) => (
              <a
                key={label}
                href={index === 0 && activePage !== "/" ? "/#pasos" : href}
                aria-current={href === activePage || (index === 0 && activePage === "/") ? "page" : undefined}
              >
                {label}
              </a>
            ))}
            <div className={`more${moreOpen ? " open" : ""}`} ref={moreRef}>
              <button type="button" aria-expanded={moreOpen} aria-haspopup="true" onClick={() => setMoreOpen((open) => !open)}>
                Más <ChevronDown aria-hidden="true" />
              </button>
              <div className="mega">
                {moreLinks.map(([title, description, href]) => (
                  <a href={href} key={title} aria-current={href === activePage ? "page" : undefined}>
                    <strong>{title}</strong><span>{description}</span>
                  </a>
                ))}
              </div>
            </div>
          </nav>

          <div className="hdr-actions">
            <a className="login-link" href="/login">Iniciar sesión</a>
            <Link className="btn btn-primary btn-sm" href="/tests">
              <span>Empieza sin pagar</span><span className="ico"><ArrowIcon /></span>
            </Link>
            <button
              className="burger"
              ref={menuButtonRef}
              type="button"
              aria-expanded={mobileOpen}
              aria-label="Abrir menú"
              data-menu-open
              onClick={() => setMobileOpen(true)}
            >
              <Menu aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-menu${mobileOpen ? " open" : ""}`} role="dialog" aria-modal="true" aria-label="Menú">
        <div className="mm-top">
          <img src="/assets/teilen-logo-white.png" alt="Teilen Teens" width="62" height="46" />
          <button className="burger" style={{ display: "grid" }} type="button" data-menu-close aria-label="Cerrar menú" onClick={closeMobileMenu}>
            <X aria-hidden="true" />
          </button>
        </div>
        <nav className="mm-links" aria-label="Menú móvil">
          {primaryLinks.map(([label, href]) => <a key={label} href={href} onClick={closeMobileMenu}>{label}</a>)}
          {moreLinks.map(([label, , href]) => (
                  <a className="minor" key={label} href={href} aria-current={href === activePage ? "page" : undefined} onClick={closeMobileMenu}>{label}</a>
          ))}
          <a className="minor" href="/contacto" onClick={closeMobileMenu}>Contacto</a>
        </nav>
        <div className="mm-cta">
          <Link className="btn btn-primary" href="/tests"><span>Empieza sin pagar</span><span className="ico"><ArrowIcon /></span></Link>
          <a className="btn btn-line" href="/login">Iniciar sesión</a>
        </div>
      </div>
    </>
  );
}

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7" /><path d="M8 7h9v9" /></svg>;
}
