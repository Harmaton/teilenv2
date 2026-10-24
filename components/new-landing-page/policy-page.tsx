import type { ReactNode } from "react";
import Link from "next/link";
import LandingNav from "./nav";
import EcosystemSection from "./ecosystem-section";
import LandingFooter, { WhatsAppFloat } from "./footer";
import { PriceSection } from "./steps-section";

type PolicySection = { id: string; title: string; content: ReactNode };

const privacySections: PolicySection[] = [
  { id: "responsable", title: "1. Responsable del tratamiento", content: <p>La identificación legal, fiscal y de contacto del responsable se publicará una vez verificada la titularidad formal de la operación de Teilen Teens. Para consultas de privacidad: <a className="text-link" href="mailto:talento@teilenteens.com">talento@teilenteens.com</a>.</p> },
  { id: "datos", title: "2. Qué información se recoge", content: <><p>La evaluación puede requerir datos mínimos de cuenta, edad o fecha de nacimiento, país y respuestas sobre capacidades, preferencias, valores, formas de aprendizaje y patrones personales.</p><p>La compra puede implicar datos de la transacción. Las preguntas que haces a Salomón IA son una categoría distinta. Algunas respuestas podrían revelar convicciones u otros datos especialmente protegidos, por lo que reciben medidas reforzadas de necesidad, base legal y acceso.</p></> },
  { id: "finalidad", title: "3. Para qué se usa", content: <p>Para registrar tu cuenta, evaluar tus respuestas con el motor metodológico, elaborar tu informe, habilitar la compra que elijas, prestar las consultas con Salomón IA y darte soporte. Las investigaciones, el newsletter, la publicidad o los testimonios requieren autorizaciones específicas cuando corresponda, y nunca son condición para comprar.</p> },
  { id: "menores", title: "4. Participantes menores de edad", content: <p>Teilen está pensado para participantes desde los 13 años. Para todos los menores de 18 se exige la autorización verificable de un responsable, además de una explicación y la aceptación del adolescente, según los requisitos de cada país. Antes de recoger respuestas se informan la finalidad, los accesos, el uso de tecnología y cómo ejercer derechos. <a className="text-link" href="/menores">Ver el proceso para familias</a>.</p> },
  { id: "ia", title: "5. Motor de evaluación e inteligencia artificial", content: <><p>Un motor metodológico realiza el cálculo técnico. La IA recibe solo la salida necesaria para convertirla en un informe claro y visual. Salomón IA es una funcionalidad posterior y separada que permite hacer consultas sobre el informe.</p><p>La versión final de esta política identificará las categorías de proveedores y sus condiciones, incluidas las posibles transferencias internacionales.</p></> },
  { id: "acceso", title: "6. Quién puede acceder", content: <p>Los permisos distinguen entre participante, responsable legal cuando corresponda, soporte autorizado y personal técnico con acceso mínimo según su función. Colegios, afiliados, anunciantes y patrocinadores no reciben respuestas individuales, conversaciones ni perfiles por su vínculo comercial. Cualquier informe institucional agregado requiere base legal y control del riesgo de reidentificación.</p> },
  { id: "seguridad", title: "7. Almacenamiento, seguridad y conservación", content: <p>La versión contractual describirá la infraestructura utilizada, las medidas técnicas y organizativas, el control de accesos, las copias de seguridad, la gestión de incidentes y los plazos de conservación.</p> },
  { id: "derechos", title: "8. Tus derechos", content: <p>Según la ley aplicable, tú y tus representantes pueden pedir información sobre tus datos y solicitar su acceso, corrección, supresión, oposición o la retirada de autorizaciones cuando corresponda. El procedimiento y los plazos se detallarán para cada país donde operemos.</p> },
  { id: "comunicaciones", title: "9. Investigación y comunicaciones comerciales", content: <p>Participar en estudios agregados o recibir novedades comerciales no es necesario para hacer la evaluación. Cada opción tiene su propia casilla, optativa y registrada. Las participaciones históricas no se usan para una finalidad nueva sin revisar su base legal y las autorizaciones existentes.</p> },
  { id: "cookies", title: "10. Cookies y herramientas de terceros", content: <p>Este sitio no usa píxeles publicitarios y no carga videos ni publicaciones de terceros hasta que tú lo pides. La versión final documentará las cookies esenciales, de medición y opcionales, con el mecanismo de consentimiento que corresponda en cada mercado.</p> },
  { id: "contacto", title: "11. Canal de contacto", content: <p>Para preguntas o solicitudes sobre tus datos: <a className="text-link" href="mailto:talento@teilenteens.com">talento@teilenteens.com</a>.</p> },
];

const termsSections: PolicySection[] = [
  { id: "producto", title: "Producto actual", content: <><p>La evaluación inicial puede empezar sin pago. La compra de USD 50 desbloquea un informe PDF de Identidad Evolutiva de cinco páginas y cinco preguntas con Salomón IA dentro de la plataforma.</p><p>El programa Werden es distinto de este producto individual: cuesta USD 520 e incluye la evaluación, el informe y sus fases formativas.</p></> },
  { id: "pago", title: "Pago y entrega", content: <p>El pago se procesa a través de Hotmart. Antes de confirmar verás el monto final, la moneda local cuando corresponda, los impuestos, los medios de pago y el plazo de garantía. Cada compra queda asociada a tu informe dentro de la plataforma.</p> },
  { id: "preguntas", title: "Alcance de las cinco preguntas", content: <p>La compra individual incluye cinco preguntas a Salomón IA. No incluye acceso ilimitado ni sustituye la atención humana especializada. Las reglas sobre cómo se cuentan los mensajes y qué ocurre ante una falla técnica se publicarán junto con las condiciones de compra.</p> },
  { id: "actualizaciones", title: "Actualizaciones posteriores", content: <p>Los módulos futuros no son una promesa indefinida de nuevas evaluaciones gratuitas. Cualquier ampliación incluida en una edición comprada se informará con su alcance, plazo y condiciones.</p> },
  { id: "reembolsos", title: "Garantía y reembolsos", content: <p>El plazo y el procedimiento de garantía y reembolso se muestran antes del pago, conforme a la configuración del medio de pago y a la normativa de tu país. Consultas: <a className="text-link" href="mailto:talento@teilenteens.com">talento@teilenteens.com</a>.</p> },
  { id: "uso", title: "Uso responsable", content: <p>El informe es orientativo: no es clínico ni determinante. No debe usarse para decisiones discriminatorias, admisión académica, selección laboral automatizada, diagnósticos de salud ni perfiles comerciales de menores. Los derechos sobre el contenido, la marca y la infraestructura se detallarán en la versión contractual definitiva.</p> },
];

export function PrivacyPolicyPage() {
  return <PolicyDocument activePage="/privacy-notice" title="Tu identidad es tuya. Tu información merece cuidado." eyebrow="Centro de confianza" status="Documento en revisión" intro="Esta es la estructura de nuestra Política de Privacidad. La versión contractual completa, con la entidad responsable, los proveedores, el almacenamiento, la conservación y las transferencias, estará disponible antes de que te registres." sections={privacySections} />;
}

export function TermsPage() {
  return <PolicyDocument activePage="/terms-of-service" title="Condiciones claras antes de comprar." eyebrow="Centro de confianza" status="Borrador en revisión" intro="Qué compras, cómo se paga y qué puedes esperar. La versión contractual definitiva incorporará los datos legales del operador y la política de garantía y reembolsos." sections={termsSections} />;
}

const refundSections: PolicySection[] = [
  {
    id: "garantia",
    title: "1. Garantía voluntaria de 7 días",
    content: (
      <>
        <p>
          Ofrecemos una garantía de devolución de 7 días para las compras digitales pagadas directamente en Teilen Teens, incluidos los reportes premium y el acceso de pago a Teilen AI/Salomon. Podés pedir un reembolso completo dentro de los 7 días calendario posteriores a la fecha de compra, sin necesidad de justificar el motivo.
        </p>
        <p>
          Esta garantía voluntaria no limita los derechos de reembolso, desistimiento o protección al consumidor que te reconozca la legislación aplicable; esos derechos pueden tener plazos o condiciones distintos.
        </p>
      </>
    ),
  },
  {
    id: "solicitud",
    title: "2. Cómo solicitarlo",
    content: (
      <>
        <p>
          Enviá tu solicitud a <a className="text-link" href="mailto:hola@simplelifemindset.com">hola@simplelifemindset.com</a> indicando el correo electrónico asociado a tu cuenta, la fecha aproximada de compra y, si está disponible, el identificador de transacción de Paddle. No envíes números completos de tarjeta ni datos financieros sensibles.
        </p>
        <p>
          Revisaremos la solicitud y te confirmaremos el estado por correo. Si la compra fue procesada por Paddle, el reembolso se enviará al método de pago original a través de Paddle. El tiempo para que aparezca en tu cuenta depende del proveedor de pago y de tu entidad financiera.
        </p>
      </>
    ),
  },
  {
    id: "acceso",
    title: "3. Acceso después del reembolso",
    content: (
      <p>
        Cuando se aprueba un reembolso, podemos deshabilitar el acceso al reporte, chat u otro contenido digital asociado con esa compra. Si el pago está pendiente, fue rechazado o no se completó, no se considera una compra confirmada y no se requiere una devolución.
      </p>
    ),
  },
  {
    id: "terceros",
    title: "4. Compras y cargos de terceros",
    content: (
      <p>
        Esta política se aplica a productos comprados mediante el checkout de Teilen Teens. Para una compra realizada en otra plataforma o por un tercero, consultá las condiciones del vendedor correspondiente. Paddle puede mostrar términos adicionales durante el pago; nada de lo indicado aquí reduce derechos obligatorios que te correspondan.
      </p>
    ),
  },
  {
    id: "contacto",
    title: "5. Contacto",
    content: (
      <p>
        Si tenés preguntas o no recibiste confirmación, escribinos a <a className="text-link" href="mailto:hola@simplelifemindset.com">hola@simplelifemindset.com</a> o contactanos por WhatsApp al <a className="text-link" href="https://wa.me/5435175680433">+54 3517 56-8043</a>. Incluí únicamente los datos necesarios para localizar la compra.
      </p>
    ),
  },
];

export function RefundPolicyPage() {
  return (
    <PolicyDocument
      activePage="/refund-policy"
      title="Tu compra, con condiciones claras."
      eyebrow="Compras y devoluciones"
      status="Garantía voluntaria de 7 días"
      intro="Conoce cómo solicitar un reembolso por una compra digital y qué ocurre con el acceso al contenido."
      sections={refundSections}
    />
  );
}

export function PricingPage() {
  return (
    <>
      <LandingNav activePage="/precio" />
      <main id="contenido">
        <section className="phero bg-paper dots-ink">
          <div className="wrap">
            <p className="kicker">Precio y contenido</p>
            <h1>Un precio claro, antes de decidir.</h1>
            <p className="lead">
              La evaluación inicial es gratuita. Solo pagas si eliges desbloquear el informe completo.
            </p>
          </div>
        </section>
        <PriceSection />
        <section className="sec bg-white">
          <div className="wrap">
            <div className="head">
              <h2>Información antes de comprar</h2>
              <p className="lead">
                Revisa las condiciones, la privacidad y las opciones de reembolso antes de realizar tu compra.
              </p>
            </div>
            <nav className="btn-row" aria-label="Información de compra">
              <Link className="btn btn-line" href="/terms-of-service">Términos de servicio</Link>
              <Link className="btn btn-line" href="/privacy-notice">Política de privacidad</Link>
              <Link className="btn btn-line" href="/refund-policy">Política de reembolso</Link>
            </nav>
          </div>
        </section>
        <EcosystemSection />
      </main>
      <LandingFooter />
      <WhatsAppFloat />
    </>
  );
}

function PolicyDocument({ activePage, title, eyebrow, status, intro, sections }: { activePage: string; title: string; eyebrow: string; status: string; intro: string; sections: PolicySection[] }) {
  return (
    <>
      <LandingNav activePage={activePage} />
      <main id="contenido">
        <section className="phero bg-paper dots-ink"><div className="wrap"><div>
          <span className="review"><InfoIcon />{status}</span><p className="kicker" style={{ display: "flex" }}>{eyebrow}</p><h1>{title}</h1><p className="lead">{intro}</p>
        </div></div></section>
        <section className="sec bg-white"><div className="wrap"><div className="doc">
          <nav className="toc" aria-label="En esta página"><strong>En esta página</strong>{sections.map(({ id, title: label }) => <a key={id} href={`#${id}`}>{label}</a>)}</nav>
          <div className="doc-body">{sections.map(({ id, title: heading, content }) => <section id={id} key={id}><h2>{heading}</h2>{content}</section>)}</div>
        </div></div></section>
        <EcosystemSection />
      </main>
      <LandingFooter /><WhatsAppFloat />
    </>
  );
}

function InfoIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 7.8v.1" /></svg>;
}
