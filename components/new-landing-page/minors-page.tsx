import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import LandingNav from "./nav";
import LandingFooter, { WhatsAppFloat } from "./footer";
import EcosystemSection from "./ecosystem-section";

const participationSteps = [
  {
    title: "Inicio: edad y país",
    description: "La plataforma pregunta la edad o la fecha de nacimiento y el país, sin recoger respuestas de la evaluación.",
  },
  {
    title: "Invitación: correo del responsable",
    description: "La persona adulta recibe un enlace temporal y verifica su dirección.",
  },
  {
    title: "Información y consentimiento específico",
    description: "Se informa la finalidad, los datos recogidos, el papel del algoritmo y la IA, quién puede acceder y los derechos de la familia. La publicidad y la investigación son opcionales y se autorizan por separado.",
  },
  {
    title: "Participación: el joven acepta y responde",
    description: "Un aviso adaptado a su edad explica para qué sirve Teilen. El adulto no responde en nombre del adolescente.",
  },
  {
    title: "Compra opcional",
    description: "Si la familia decide comprar, el pago se asocia de forma segura al informe correcto, sin compartir respuestas ni puntuaciones por WhatsApp.",
  },
];

export default function MinorsPage() {
  return (
    <>
      <LandingNav activePage="/menores" />
      <main id="contenido">
        <section className="phero bg-paper dots-ink legal-hero">
          <div className="wrap">
            <span className="upd">Vigente desde el 26 de octubre de 2026</span>
            <p className="kicker">Familias y adolescentes</p>
            <h1>Primero la autorización. Después la evaluación.</h1>
            <p className="lead">
              Cuando quien responde es menor de edad, Teilen sigue un proceso
              diferenciado. No es una casilla al final: la persona responsable
              recibe información comprensible y autoriza antes de que se
              recojan las respuestas.
            </p>
          </div>
        </section>

        <section className="sec bg-lilac">
          <div className="wrap">
            <div className="head">
              <h2>Desde los 13 años, con un proceso adecuado a cada edad.</h2>
            </div>
            <div className="steps">
              <article className="step">
                <span className="num">1</span>
                <h3>Menos de 13</h3>
                <p>Sin acceso a la evaluación. El acceso está bloqueado; la persona adulta puede <Link className="text-link" href="/contacto">contactar al equipo</Link>.</p>
              </article>
              <article className="step">
                <span className="num">2</span>
                <h3>13 a 17</h3>
                <p>Se requiere autorización verificable de la persona responsable, además de la explicación y aceptación del joven y las normas de su país.</p>
              </article>
              <article className="step">
                <span className="num">3</span>
                <h3>18 o más</h3>
                <p>La persona crea su propia cuenta y acepta los términos del servicio y la política de privacidad.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="sec bg-white">
          <div className="wrap">
            <div className="head">
              <h2>El adulto autoriza. El adolescente responde.</h2>
              <p className="lead">Así es el recorrido para participantes de 13 a 17 años.</p>
            </div>
            <div className="callout violet">
              <span className="ic"><ShieldCheck aria-hidden="true" /></span>
              <div>
                <p>
                  <strong>Privacidad familiar.</strong> Quien autoriza o paga no
                  recibe acceso automático a cada respuesta ni a las
                  conversaciones con Salomón IA solo por pagar. El informe se
                  conversa con el adolescente, y la persona responsable puede
                  ejercer sus derechos según la ley de su país.
                </p>
                <Link className="text-link" href="/privacidad">Leer la política de privacidad</Link>
              </div>
            </div>
            <ol className="steps minors-steps">
              {participationSteps.map((step, index) => (
                <li className="step" key={step.title}>
                  <span className="num">{index + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="sec bg-sun">
          <div className="wrap">
            <div className="head">
              <h2>¿Quieres verlo antes de autorizar?</h2>
              <p className="lead">Mira cómo es el informe con un caso ficticio y decide con tu hijo si vale la pena.</p>
            </div>
            <div className="btn-row">
              <Link className="btn btn-ink" href="/#ejemplo">Ver un informe de ejemplo</Link>
              <Link className="btn btn-line" href="/familias">Leer para familias</Link>
            </div>
          </div>
        </section>
        <EcosystemSection />
      </main>
      <LandingFooter />
      <WhatsAppFloat />
    </>
  );
}
