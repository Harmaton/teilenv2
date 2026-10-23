import type { Metadata } from "next";
import { LegalPage } from "@/app/legal/legal-page";

export const metadata: Metadata = {
  title: "Aviso de privacidad | Teilen Teens",
  description: "Cómo Teilen Teens recopila, utiliza y protege tus datos personales.",
};

export default function PrivacyNoticePage() {
  return (
    <LegalPage
      eyebrow="Tus datos, con claridad"
      title="Aviso de privacidad"
      description="Te contamos qué información usamos para brindarte el servicio, cómo la protegemos y qué opciones tenés."
    >
      <section>
        <h2>1. Quién trata tus datos</h2>
        <p>
          Teilen Teens, desarrollado por Simple Life Foundation en Córdoba, Argentina, es responsable del tratamiento de los datos personales que recopilamos a través del sitio. Para consultas o solicitudes relacionadas con privacidad, escribí a <a href="mailto:hola@simplelifemindset.com">hola@simplelifemindset.com</a>.
        </p>
      </section>

      <section>
        <h2>2. Información que recopilamos</h2>
        <ul>
          <li>Datos de cuenta y contacto, como nombre, correo electrónico y credenciales de acceso.</li>
          <li>Información de perfil que decidís proporcionar, por ejemplo edad, ciudad, país, intereses y preferencias.</li>
          <li>Respuestas a evaluaciones y datos derivados, como puntajes, resultados y reportes personalizados.</li>
          <li>Datos de uso y seguridad necesarios para operar la plataforma, mantener la sesión, prevenir abusos y solucionar problemas técnicos.</li>
          <li>Información de compra y estado de pago. Los datos completos de tarjeta se procesan con Paddle y no los almacenamos en nuestros servidores.</li>
          <li>Mensajes que nos enviás al pedir asistencia.</li>
        </ul>
      </section>

      <section>
        <h2>3. Para qué usamos la información</h2>
        <ul>
          <li>Crear y proteger tu cuenta y prestar las funciones que solicitás.</li>
          <li>Calcular resultados y generar, guardar y mostrar tus reportes.</li>
          <li>Procesar compras, habilitar los productos adquiridos y gestionar reembolsos o consultas de facturación.</li>
          <li>Enviar comunicaciones operativas, como verificaciones de cuenta, avisos importantes y respuestas de soporte.</li>
          <li>Detectar fraude, proteger la plataforma, cumplir obligaciones legales y resolver disputas.</li>
          <li>Mejorar el servicio utilizando información de manera compatible con este aviso y la normativa aplicable.</li>
        </ul>
      </section>

      <section>
        <h2>4. Servicios que nos ayudan</h2>
        <p>
          Para operar la plataforma podemos compartir los datos estrictamente necesarios con proveedores que actúan en nuestro nombre. Entre ellos se encuentran Supabase (cuentas, base de datos y alojamiento), Paddle (checkout y pagos), OpenAI (generación asistida de reportes cuando se solicita esa función) y Resend (entrega de correos electrónicos). Estos proveedores procesan información conforme a sus funciones, medidas de seguridad y condiciones aplicables.
        </p>
        <p>
          Los datos pueden procesarse en países distintos de tu lugar de residencia. Cuando corresponda, tomamos medidas razonables para protegerlos y exigimos a nuestros proveedores salvaguardas adecuadas. No vendemos datos personales a terceros.
        </p>
      </section>

      <section>
        <h2>5. Inteligencia artificial y contenido personal</h2>
        <p>
          Si pedís un reporte generado con asistencia de inteligencia artificial, las respuestas relevantes de la evaluación y los datos necesarios para personalizarlo pueden enviarse a nuestro proveedor tecnológico para producir ese resultado. No incluyas en respuestas información sensible que no sea necesaria. Los resultados pueden requerir tu propio criterio y no son una decisión automatizada con efectos legales sobre vos.
        </p>
      </section>

      <section>
        <h2>6. Conservación y seguridad</h2>
        <p>
          Conservamos la información mientras sea necesaria para mantener tu cuenta, prestar el servicio, conservar tus reportes, atender solicitudes y cumplir obligaciones legales. Podés solicitar la eliminación de tu cuenta; algunos datos podrán conservarse por el tiempo exigido por ley o para resolver reclamos legítimos.
        </p>
        <p>
          Aplicamos medidas administrativas y técnicas razonables para proteger la información. Ningún sistema conectado a internet puede garantizar seguridad absoluta; si detectamos un incidente que requiera notificación, actuaremos conforme a la normativa aplicable.
        </p>
      </section>

      <section>
        <h2>7. Tus opciones y derechos</h2>
        <p>
          Según la normativa que te corresponda, podés solicitar acceso, corrección, actualización o eliminación de tus datos, retirar consentimientos cuando corresponda y presentar una consulta o reclamo ante la autoridad competente. Escribinos a <a href="mailto:hola@simplelifemindset.com">hola@simplelifemindset.com</a>; podremos pedir información razonable para verificar tu identidad y proteger tu cuenta.
        </p>
        <p>
          En Argentina, la Agencia de Acceso a la Información Pública es la autoridad de aplicación de la Ley 25.326 y recibe denuncias y reclamos relacionados con la protección de datos personales.
        </p>
      </section>

      <section>
        <h2>8. Cookies y tecnologías esenciales</h2>
        <p>
          Utilizamos almacenamiento y tecnologías esenciales para mantener la sesión, proteger el acceso y permitir el funcionamiento del sitio. Si en el futuro incorporamos tecnologías no esenciales, actualizaremos este aviso y solicitaremos consentimiento cuando la ley lo requiera. También podés administrar cookies desde la configuración de tu navegador, aunque ciertas funciones pueden dejar de estar disponibles.
        </p>
      </section>

      <section>
        <h2>9. Privacidad de menores y cambios</h2>
        <p>
          Si sos menor de 18 años, usá el servicio con autorización y acompañamiento de una persona adulta responsable. Esa persona puede contactarnos para consultar o solicitar acciones sobre los datos del menor. Actualizaremos este aviso cuando cambien nuestras prácticas; la fecha indicada refleja la revisión vigente.
        </p>
      </section>
    </LegalPage>
  );
}
