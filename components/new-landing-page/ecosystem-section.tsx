import Reveal from "./reveal";
import { ArrowUpRightIcon, InstagramIcon, LinkedInIcon, PodcastIcon, WhatsAppIcon, YouTubeIcon } from "./icons";

const ecosystem = [
  {
    className: "eco-w",
    image: "/assets/werden-logo.png",
    alt: "Werden",
    label: "Programa de 6 meses",
    description: "Después de Teilen: entrenas tu don en cinco proyectos reales y terminas con tu primer manifiesto.",
    action: "Conocer Werden",
    href: "https://werden.vercel.app/",
  },
  {
    className: "eco-p",
    image: "/assets/paralaje-logo.png",
    alt: "PARALAJE",
    label: "Gimnasio intelectual",
    description: "Un laboratorio de pensamiento colectivo para entrenar la percepción, la adaptabilidad y el pensamiento en comunidad. Virtual y de ingreso libre.",
    action: "Entrar a PARALAJE",
    href: "https://paralaje.site/",
  },
  {
    className: "eco-i",
    image: "/assets/interpretacion-emocional-logo.webp",
    alt: "Interpretación Emocional",
    label: "Certificación internacional",
    description: "Interpretación Emocional Aplicada: el método de Salomón Boss para comprender cómo se construye una emoción antes de nombrarla.",
    action: "Ver la certificación",
    href: "https://interpretacion-emocional.vercel.app/",
  },
  {
    className: "eco-s",
    image: "/assets/simplelife-logo-full.webp",
    alt: "Simple Life",
    label: "Comunidad web gratuita",
    description: "El espacio de Simple Life para seguir aprendiendo, conversar y crecer en comunidad.",
    action: "Entrar al espacio",
    href: "https://espacio.simplelifemindset.com/",
  },
];

export default function EcosystemSection() {
  return (
    <section className="eco" id="nosotros">
      <div className="wrap">
        <Reveal className="eco-head">
          <span className="sticker violet">Más allá de Teilen</span>
          <h2>Tu crecimiento no termina en un informe.</h2>
          <p className="lead">Teilen es la puerta de entrada. Estos espacios te acompañan después: entrenamiento, pensamiento, emociones y comunidad.</p>
        </Reveal>
        <div className="eco-grid">
          {ecosystem.map((item) => (
            <Reveal key={item.label}>
              <a className={`eco-card ${item.className}`} href={item.href} target="_blank" rel="noopener noreferrer">
                <span className="eco-logo"><img src={item.image} alt={item.alt} loading="lazy" /></span>
                <span className="eco-k">{item.label}</span>
                <p>{item.description}</p>
                <span className="eco-go">{item.action}<span className="ico"><ArrowUpRightIcon /></span></span>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="social" aria-label="Canales de Salomón Boss y Teilen Teens">
            <p className="social-t">Síguenos y conversa con nosotros</p>
            <div className="social-row">
              <a className="soc" href="https://www.youtube.com/@SalomonBoss" target="_blank" rel="noopener noreferrer"><span className="soc-ic"><YouTubeIcon /></span><span><b>YouTube</b><small>@SalomonBoss</small></span></a>
              <a className="soc" href="https://open.spotify.com/show/1gyIEk6psnsLpMN1y17v6f" target="_blank" rel="noopener noreferrer"><span className="soc-ic"><PodcastIcon /></span><span><b>Podcast</b><small>en Spotify</small></span></a>
              <a className="soc" href="https://www.linkedin.com/newsletters/el-valor-humano-7512193265182564352/" target="_blank" rel="noopener noreferrer"><span className="soc-ic"><LinkedInIcon /></span><span><b>El Valor Humano</b><small>newsletter en LinkedIn</small></span></a>
              <a className="soc" href="https://www.instagram.com/teilenteens/" target="_blank" rel="noopener noreferrer"><span className="soc-ic"><InstagramIcon /></span><span><b>Instagram</b><small>@teilenteens</small></span></a>
              <a className="soc" href="https://chat.whatsapp.com/Jpb9REdw8fk7PHN7S8whf3?mode=hqrt1" target="_blank" rel="noopener noreferrer"><span className="soc-ic"><WhatsAppIcon /></span><span><b>Comunidad</b><small>de WhatsApp</small></span></a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
