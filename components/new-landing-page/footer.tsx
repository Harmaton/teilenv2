import Link from "next/link";
import { InstagramIcon, LinkedInIcon, MailIcon, PodcastIcon, WhatsAppIcon, YouTubeIcon } from "./icons";

export default function LandingFooter() {
  return (
    <footer className="ftr">
      <div className="wrap">
        <p className="ftr-big" aria-hidden="true">¿Para qué eres bueno?</p>
        <div className="ftr-top">
          <div className="ftr-brand">
            <Link href="/" aria-label="Teilen Teens, inicio"><img className="lg" src="/assets/teilen-logo-white.png" alt="Teilen Teens" width="97" height="72" /></Link>
            <p>Una plataforma para comprender tu identidad, reconocer tus capacidades y construir dirección.</p>
            <div className="ftr-social">
              <a href="https://www.youtube.com/@SalomonBoss" target="_blank" rel="noopener noreferrer" aria-label="YouTube de Salomón Boss"><YouTubeIcon /></a>
              <a href="https://open.spotify.com/show/1gyIEk6psnsLpMN1y17v6f" target="_blank" rel="noopener noreferrer" aria-label="Podcast en Spotify"><PodcastIcon /></a>
              <a href="https://www.instagram.com/teilenteens/" target="_blank" rel="noopener noreferrer" aria-label="Instagram de Teilen Teens"><InstagramIcon /></a>
              <a href="https://www.linkedin.com/newsletters/el-valor-humano-7512193265182564352/" target="_blank" rel="noopener noreferrer" aria-label="Newsletter El Valor Humano en LinkedIn"><LinkedInIcon /></a>
              <a href="https://wa.me/5493517623874" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><WhatsAppIcon /></a>
              <a href="mailto:talento@teilenteens.com" aria-label="Correo"><MailIcon /></a>
            </div>
            <div className="ftr-sl"><span>Una iniciativa de</span><img src="/assets/simplelife-logo.png" alt="Fundación Simple Life" width="131" height="26" /></div>
          </div>

          <div><h4>Teilen Teens</h4><nav aria-label="Producto">
            <Link href="/#pasos">Cómo funciona</Link><Link href="/jovenes">Para jóvenes</Link><Link href="/familias">Para familias</Link>
            <Link href="/colegios">Para colegios</Link><Link href="/docentes">Para docentes</Link><Link href="/salomon-ia">Salomón IA</Link><Link href="/experiencias">Experiencias</Link>
          </nav></div>

          <div><h4>Ecosistema</h4><nav aria-label="Ecosistema">
            <Link href="/nosotros">Equipo e historia</Link><Link href="/metodologia">Método</Link><a href="https://werden.vercel.app/">Werden</a>
            <Link href="/comunidad">Comunidad Teilen</Link><Link href="/#mentorias">Mentorías</Link><Link href="/mecenas">Mecenas Teilen</Link><Link href="/el-valor-humano">El Valor Humano</Link><Link href="/vision">Visión</Link>
          </nav></div>

          <div><h4>Confianza y contacto</h4><nav aria-label="Legal y contacto">
            <Link href="/privacy-notice">Privacidad</Link><Link href="/menores">Participación de menores</Link><Link href="/terms-of-service">Condiciones y compras</Link>
            <Link href="/aviso-ia">Uso responsable de la IA</Link><Link href="/contacto">Contacto</Link>
            <a href="mailto:talento@teilenteens.com">talento@teilenteens.com</a>
          </nav></div>
        </div>
        <div className="ftr-bottom">
          <span>© 2026 Teilen Teens. Desarrollado con Fundación Simple Life. Córdoba, Argentina.</span>
          <span>Un resultado describe un momento. No define a nadie.</span>
        </div>
      </div>
    </footer>
  );
}

export function WhatsAppFloat() {
  return (
    <a className="wa-float" href="https://wa.me/5493517623874?text=Hola%2C%20quiero%20saber%20m%C3%A1s%20sobre%20Teilen%20Teens." target="_blank" rel="noopener noreferrer" aria-label="Escríbenos por WhatsApp al +54 9 3517 62-3874">
      <span className="wa-ic"><WhatsAppIcon /></span>
      <span className="wa-txt"><small>Escríbenos por WhatsApp</small><b>+54 9 3517 62-3874</b></span>
    </a>
  );
}
