
'use client'
import React from "react";
import { theme } from "@/lib/theme";
import { useBreakpoint, useFadeIn } from "@/hooks/use-breakpoint";

type TeamLead = {
  initial: string;
  avatarBg: string;
  name: string;
  role: string;
  bio: string;
  email: string;
  linkedin: string;
  website?: { label: string; href: string };
};

type Skill = { icon: string; title: string; desc: string };

const founder: TeamLead = {
  initial: "S",
  avatarBg: theme.colors.navy,
  name: "Salomón Velásquez",
  role: "Fundador · Director General · Creador del Sistema Teilen",
  bio: "Psicólogo, filósofo y coach con credencial PCC (Professional Certified Coach). Durante más de 15 años trabajó con jóvenes, profesionales y equipos ejecutivos en Argentina y América Latina, ayudándolos a identificar su talento y construir proyectos de vida coherentes con quiénes son. Es el fundador de Simple Life Foundation y el arquitecto metodológico del sistema Teilen. Su convicción de fondo: el talento humano no se forma en las organizaciones — se descubre antes de llegar a ellas.",
  email: "hola@simplelifemindset.com",
  linkedin: "https://www.linkedin.com/in/salomonvelasquez",
  website: { label: "🌐 simplelifemindset.com", href: "https://www.simplelifemindset.com" },
};

const techLead: TeamLead = {
  initial: "H",
  avatarBg: "#0f3460",
  name: "Harmaton Njagi",
  role: "Director de Ingeniería & Arquitectura de Plataforma",
  bio: "Lidera el equipo técnico responsable de construir y escalar la plataforma Teilen Teens. Con experiencia en arquitectura de sistemas y desarrollo de productos digitales a escala, garantiza que cada reporte sea generado con la precisión y velocidad que el usuario espera.",
  email: "harmaton@teilenteens.com",
  linkedin: "https://www.linkedin.com/in/harmatonnjagi",
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
  initial: "P",
  avatarBg: "#1a4a2e",
  name: "Pietro Moura",
  role: "Director de Investigación Científica y Metodología",
  bio: "Lidera el equipo interdisciplinario que valida, actualiza y profundiza el sustento científico del sistema Teilen Teens. Garantiza que cada estudio integrado sea metodológicamente riguroso, culturalmente pertinente para el contexto latinoamericano y éticamente aplicado.",
  email: "pietro@teilenteens.com",
  linkedin: "https://www.linkedin.com/in/pietromoura",
};

const researchSkills: Skill[] = [
  { icon: "🧠", title: "Psicología del Comportamiento", desc: "Validación de estudios que miden fortalezas, estilos cognitivos y patrones emocionales." },
  { icon: "🔬", title: "Neurociencias Aplicadas", desc: "Integración de hallazgos sobre procesamiento cerebral y estilos de aprendizaje." },
  { icon: "🌍", title: "Antropología Social", desc: "Contextualización cultural de los perfiles para jóvenes latinoamericanos." },
  { icon: "📐", title: "Filosofía y Ética", desc: "Marcos conceptuales que sostienen la metodología de identidad." },
  { icon: "📈", title: "Sociología del Desarrollo", desc: "Análisis de tendencias vocacionales y laborales para la orientación." },
  { icon: "✅", title: "Validación Continua", desc: "Revisión permanente de los estudios para garantizar vigencia." },
];

function TeamGroup({ label, lead, skills, isTablet }: { label: string; lead: TeamLead; skills?: Skill[]; isTablet: boolean }) {
  return (
    <div style={{ marginBottom: 72 }}>
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: ".22em",
          textTransform: "uppercase",
          color: theme.colors.orange,
          borderBottom: `2px solid ${theme.colors.orange}`,
          paddingBottom: 10,
          marginBottom: 32,
          display: "block",
        }}
      >
        {label}
      </span>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isTablet ? "1fr" : "auto 1fr",
          gap: 32,
          alignItems: "start",
          backgroundColor: theme.colors.grayBg,
          borderRadius: 14,
          padding: 32,
          borderLeft: `4px solid ${theme.colors.orange}`,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            backgroundColor: lead.avatarBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 34,
            fontWeight: 900,
            color: theme.colors.orange,
            border: `3px solid ${theme.colors.orange}`,
            flexShrink: 0,
          }}
        >
          {lead.initial}
        </div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: theme.colors.navy, marginBottom: 3 }}>{lead.name}</div>
          <div style={{ fontSize: 11, color: theme.colors.orange, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".09em", marginBottom: 10 }}>
            {lead.role}
          </div>
          <p style={{ fontSize: 13, color: theme.colors.bodyText, lineHeight: 1.72, marginBottom: 14 }}>{lead.bio}</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a
              href={`mailto:${lead.email}`}
              style={{
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
              }}
            >
              ✉ {lead.email}
            </a>
            <a
              href={lead.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{
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
              }}
            >
              in LinkedIn
            </a>
            {lead.website && (
              <a
                href={lead.website.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
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
                }}
              >
                {lead.website.label}
              </a>
            )}
          </div>
        </div>
      </div>

      {skills && (
        <div style={{ display: "grid", gridTemplateColumns: isTablet ? "1fr" : "repeat(3, 1fr)", gap: 18 }}>
          {skills.map((s, i) => (
            <div key={i} style={{ backgroundColor: theme.colors.grayBg, borderRadius: 10, padding: 20, borderLeft: `3px solid ${theme.colors.orange}` }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontWeight: 700, color: theme.colors.navy, fontSize: 13, marginBottom: 3 }}>{s.title}</div>
              <div style={{ fontSize: 11, color: theme.colors.muted, lineHeight: 1.55 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TeamSection() {
  const { isTablet } = useBreakpoint();
  const { ref, style: fadeStyle } = useFadeIn<HTMLDivElement>();

  return (
    <section style={{ backgroundColor: theme.colors.white, padding: "96px 0", fontFamily: theme.font }} ref={ref}>
      <div style={{ ...fadeStyle, maxWidth: 1140, margin: "0 auto", padding: "0 32px" }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".22em", textTransform: "uppercase", color: theme.colors.orange, display: "block", marginBottom: 14 }}>
          Quiénes hacen posible esto
        </span>
        <h2 style={{ fontSize: isTablet ? 28 : 38, fontWeight: 900, color: theme.colors.navy, lineHeight: 1.15, marginBottom: 18 }}>
          Las personas detrás de cada reporte.
        </h2>
        <p style={{ fontSize: 16, color: theme.colors.muted, marginBottom: 60, maxWidth: 580 }}>
          Teilen Teens es el resultado de tres equipos que trabajan en paralelo: fundación, tecnología y ciencia.
        </p>

        <TeamGroup label="Fundador y Creador" lead={founder} isTablet={isTablet} />
        <TeamGroup label="Equipo Técnico — Director: Harmaton Njagi" lead={techLead} skills={techSkills} isTablet={isTablet} />
        <TeamGroup label="Equipo de Investigación — Director: Pietro Moura" lead={researchLead} skills={researchSkills} isTablet={isTablet} />
      </div>
    </section>
  );
}