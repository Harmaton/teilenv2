"use client";

import { useState } from "react";
import { theme } from "@/lib/theme";
import { useBreakpoint, useFadeIn } from "@/hooks/use-breakpoint";
import styles from "./TeamSection.module.css";

type TeamLead = {
  name: string;
  role: string;
  bio: string;
  email: string;
  linkedin: string;
  website?: { label: string; href: string };
  image: string;
};

type Skill = { icon: string; title: string; desc: string };

const founder: TeamLead = {
  name: "Salomón Velásquez",
  role: "Fundador · Director General · Creador del Sistema Teilen",
  bio: "Psicólogo, filósofo y coach con credencial PCC (Professional Certified Coach). Durante más de 15 años trabajó con jóvenes, profesionales y equipos ejecutivos en Argentina y América Latina, ayudándolos a identificar su talento y construir proyectos de vida coherentes con quiénes son. Es el fundador de Simple Life Foundation y el arquitecto metodológico del sistema Teilen. Su convicción de fondo: el talento humano no se forma en las organizaciones — se descubre antes de llegar a ellas.",
  email: "hola@simplelifemindset.com",
  linkedin: "https://www.linkedin.com/in/salomonvelasquez",
  website: { label: "🌐 simplelifemindset.com", href: "https://www.simplelifemindset.com" },
  image: "/img/salo.jpeg",
};

const founderSkills: Skill[] = [
  { icon: "🧭", title: "Coaching Profesional (PCC)", desc: "Credencial internacional que certifica su método para guiar a personas hacia proyectos de vida coherentes con su identidad." },
  { icon: "🧠", title: "Psicología y Filosofía", desc: "Combina ambas disciplinas para entender no solo el comportamiento humano, sino el sentido detrás de él." },
  { icon: "🌱", title: "Fundador de Simple Life Foundation", desc: "Organización dedicada a ayudar a jóvenes y profesionales a descubrir su talento antes de entrar al mundo laboral." },
  { icon: "🧩", title: "Arquitecto del Sistema Teilen", desc: "Diseñó la metodología completa que cruza los estudios científicos detrás de cada reporte." },
  { icon: "🌎", title: "15+ Años de Experiencia en LatAm", desc: "Trabajó con jóvenes, profesionales y equipos ejecutivos en Argentina y toda América Latina." },
  { icon: "💡", title: "El Talento se Descubre, No se Forma", desc: "Su convicción de fondo: el talento humano no nace en las organizaciones, se descubre antes de llegar a ellas." },
];

const techLead: TeamLead = {
  name: "Harmaton Njagi",
  role: "Director de Ingeniería & Arquitectura de Plataforma",
  bio: "Lidera el equipo técnico responsable de construir y escalar la plataforma Teilen Teens. Con experiencia en arquitectura de sistemas y desarrollo de productos digitales a escala, garantiza que cada reporte sea generado con la precisión y velocidad que el usuario espera.",
  email: "harmaton@teilenteens.com",
  linkedin: "https://www.linkedin.com/in/harmatonnjagi",
  image: "/img/njagi.jpeg",
};

const techSkills: Skill[] = [
  { icon: "⚙️", title: "Ingeniería de Software", desc: "Arquitectura de backend, APIs y procesamiento del reporte en tiempo real." },
  { icon: "🤖", title: "Inteligencia Artificial", desc: "Desarrollo e integración de Salomón IA: el mentor conversacional vía WhatsApp." },
  { icon: "🎨", title: "Diseño UX/UI", desc: "Interfaz optimizada para adolescentes en dispositivos móviles." },
  { icon: "🔐", title: "Seguridad y Datos", desc: "Protección de la información y cumplimiento de privacidad." },
  { icon: "📊", title: "Algoritmo de Análisis", desc: "El motor que cruza los 6 estudios y genera reportes únicos." },
  { icon: "☁️", title: "Infraestructura Cloud", desc: "Escalabilidad para toda América Latina sin interrupciones." },
];

const researchLead: TeamLead = {
  name: "Pietro Moura",
  role: "Director de Investigación Científica y Metodología",
  bio: "Lidera el equipo interdisciplinario que valida, actualiza y profundiza el sustento científico del sistema Teilen Teens. Garantiza que cada estudio integrado sea metodológicamente riguroso, culturalmente pertinente para el contexto latinoamericano y éticamente aplicado.",
  email: "pietro@teilenteens.com",
  linkedin: "https://www.linkedin.com/in/pietromoura",
  image: "/img/pietro.jpeg",
};

const researchSkills: Skill[] = [
  { icon: "🧠", title: "Psicología del Comportamiento", desc: "Validación de estudios que miden fortalezas, estilos cognitivos y patrones emocionales." },
  { icon: "🔬", title: "Neurociencias Aplicadas", desc: "Integración de hallazgos sobre procesamiento cerebral y estilos de aprendizaje." },
  { icon: "🌍", title: "Antropología Social", desc: "Contextualización cultural de los perfiles para jóvenes latinoamericanos." },
  { icon: "📐", title: "Filosofía y Ética", desc: "Marcos conceptuales que sostienen la metodología de identidad." },
  { icon: "📈", title: "Sociología del Desarrollo", desc: "Análisis de tendencias vocacionales y laborales para la orientación." },
  { icon: "✅", title: "Validación Continua", desc: "Revisión permanente de los estudios para garantizar vigencia." },
];

const teams: { label: string; lead: TeamLead; skills: Skill[] }[] = [
  { label: "Fundador y Creador", lead: founder, skills: founderSkills },
  { label: "Equipo Técnico — Director: Harmaton Njagi", lead: techLead, skills: techSkills },
  { label: "Equipo de Investigación — Director: Pietro Moura", lead: researchLead, skills: researchSkills },
];

const pillStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  fontSize: 11,
  color: theme.colors.orange,
  fontWeight: 600,
  backgroundColor: "rgba(224,120,32,.08)",
  padding: "5px 12px",
  borderRadius: 50,
  textDecoration: "none",
};

// Photo with a subtle horizontal (Y-axis) tilt on hover.
function TiltPhoto({ src, alt, height }: { src: string; alt: string; height: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 18,
        overflow: "hidden",
        backgroundColor: theme.colors.grayBg,
        border: `3px solid ${theme.colors.orange}`,
        width: "100%",
        height,
        perspective: 900,
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          transform: hovered ? "rotateY(10deg) scale(1.04)" : "rotateY(0deg) scale(1)",
          transformOrigin: "center",
          transition: "transform .6s cubic-bezier(.22,1,.36,1)",
          willChange: "transform",
        }}
      />
    </div>
  );
}

function TeamBlock({ label, lead, skills }: { label: string; lead: TeamLead; skills: Skill[] }) {
  return (
    <div className={styles.teamBlockContainer}>
      <span className={styles.eyebrow}>{label}</span>

      {/* Image + bio, side by side on desktop, stacked on mobile */}
      <div className={styles.introGrid}>
        <TiltPhoto src={lead.image} alt={lead.name} height={340} />

        <div>
          <div className={styles.name}>{lead.name}</div>
          <div className={styles.role}>{lead.role}</div>
          <p className={styles.bio}>{lead.bio}</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href={`mailto:${lead.email}`} style={pillStyle}>✉ {lead.email}</a>
            <a href={lead.linkedin} target="_blank" rel="noopener noreferrer" style={pillStyle}>in LinkedIn</a>
            {lead.website && (
              <a href={lead.website.href} target="_blank" rel="noopener noreferrer" style={pillStyle}>
                {lead.website.label}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Skills as a static responsive grid table */}
      <div className={styles.skillsGrid}>
        {skills.map((s, i) => (
          <div key={i} className={styles.skillCard}>
            <div className={styles.skillIcon}>{s.icon}</div>
            <div className={styles.skillTitle}>{s.title}</div>
            <div className={styles.skillDesc}>{s.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TeamSection() {
  const { isTablet } = useBreakpoint();
  const { ref, style: fadeStyle } = useFadeIn<HTMLDivElement>();

  return (
    <section style={{ backgroundColor: theme.colors.white, padding: "96px 0", fontFamily: theme.font }} ref={ref}>
      <div style={{ ...fadeStyle, maxWidth: 1140, margin: "0 auto", padding: "0 32px" }}>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: ".22em",
            textTransform: "uppercase",
            color: theme.colors.orange,
            display: "block",
            marginBottom: 14,
          }}
        >
          Quiénes hacen posible esto
        </span>
        <h2 style={{ fontSize: isTablet ? 28 : 38, fontWeight: 900, color: theme.colors.navy, lineHeight: 1.15, marginBottom: 18 }}>
          Las personas detrás de cada reporte.
        </h2>
        <p style={{ fontSize: 16, color: theme.colors.muted, marginBottom: 60, maxWidth: 580 }}>
          Teilen Teens es el resultado de tres equipos que trabajan en paralelo: fundación, tecnología y ciencia.
        </p>

        {teams.map((t) => (
          <TeamBlock key={t.label} label={t.label} lead={t.lead} skills={t.skills} />
        ))}
      </div>
    </section>
  );
}