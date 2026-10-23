import type { Metadata } from "next";
import { LegalPage } from "@/app/legal/legal-page";

export const metadata: Metadata = {
  title: "Términos del servicio | Teilen Teens",
  description: "Términos para usar Teilen Teens y sus servicios digitales.",
};

export default function TermsOfServicePage() {
  return (
    <LegalPage
      eyebrow="Términos y condiciones"
      title="Términos del servicio"
      description="Estas condiciones explican cómo podés usar Teilen Teens, crear una cuenta y comprar nuestros productos digitales."
    >
      <section>
        <h2>1. Quiénes somos y aceptación</h2>
        <p>
          Teilen Teens es un servicio digital desarrollado por Simple Life Foundation, con base en Córdoba, Argentina. Al acceder al sitio, crear una cuenta o realizar una compra, aceptás estos términos y el Aviso de privacidad. Si no estás de acuerdo, no uses el servicio.
        </p>
      </section>

      <section>
        <h2>2. Edad y cuentas</h2>
        <p>
          El servicio está dirigido principalmente a jóvenes. Si tenés menos de 18 años, necesitás el permiso de tu madre, padre o representante legal para crear una cuenta, compartir información personal o realizar una compra. La persona adulta responsable debe revisar estos términos y supervisar el uso del servicio.
        </p>
        <p>
          Proporcioná información correcta, mantené tus credenciales seguras y avisános si sospechás que alguien accedió a tu cuenta. Sos responsable de la actividad realizada desde tu cuenta, salvo que la ley aplicable disponga otra cosa.
        </p>
      </section>

      <section>
        <h2>3. Qué ofrece Teilen Teens</h2>
        <p>
          Teilen Teens ofrece evaluaciones de autoconocimiento y orientación, resultados y reportes personalizados, y herramientas digitales complementarias. Algunas funciones son gratuitas; otras, como el acceso completo a ciertos reportes o servicios, pueden requerir un pago. El contenido, las funciones y los precios vigentes se muestran antes de iniciar la compra.
        </p>
        <p>
          Los resultados son recursos informativos y de reflexión personal. No constituyen diagnóstico médico o psicológico, terapia, asesoramiento profesional, ni garantía de admisión, empleo, ingresos o resultados particulares. No reemplazan la consulta con un profesional calificado.
        </p>
      </section>

      <section>
        <h2>4. Compras y pagos</h2>
        <p>
          Los pagos se procesan de forma segura a través de Paddle, nuestro proveedor de pagos y Merchant of Record para las transacciones disponibles en el checkout. Paddle puede mostrar impuestos, moneda, medios de pago y condiciones adicionales antes de confirmar. Al pagar, también aceptás las condiciones que Paddle presente para esa transacción.
        </p>
        <p>
          Los productos digitales pueden habilitarse después de confirmarse el pago. No compartas el acceso a productos o cuentas de manera que infrinja estos términos o la ley aplicable. Para conocer las condiciones de devolución, consultá la <a href="/refund-policy">Política de reembolso</a>.
        </p>
      </section>

      <section>
        <h2>5. Uso permitido y propiedad intelectual</h2>
        <p>
          Usá el servicio de manera lícita y respetuosa. No intentes acceder sin autorización a cuentas, sistemas o datos; interferir con la disponibilidad o seguridad del servicio; distribuir malware; extraer contenido de forma automatizada; ni presentar como propio el material protegido de Teilen Teens.
        </p>
        <p>
          El sitio, sus marcas, metodología, textos, diseños y software pertenecen a sus titulares o se usan con autorización. Te damos una licencia personal, limitada, no exclusiva y no transferible para utilizar las funciones y conservar tus reportes para uso privado. No podés revender, republicar ni explotar comercialmente el contenido sin autorización escrita.
        </p>
      </section>

      <section>
        <h2>6. Disponibilidad y cambios</h2>
        <p>
          Trabajamos para mantener el servicio disponible y seguro, pero no garantizamos funcionamiento ininterrumpido ni libre de errores. Podemos actualizar o discontinuar funciones por motivos operativos, legales o de seguridad. Cuando un cambio afecte sustancialmente una compra vigente, procuraremos ofrecer una solución razonable conforme a la ley aplicable.
        </p>
      </section>

      <section>
        <h2>7. Suspensión y terminación</h2>
        <p>
          Podemos limitar o suspender el acceso si hay un incumplimiento de estos términos, riesgo para otras personas o para la plataforma, o una obligación legal. Podés dejar de usar el servicio y solicitar el cierre de tu cuenta escribiendo a <a href="mailto:hola@simplelifemindset.com">hola@simplelifemindset.com</a>. La eliminación de la cuenta no afecta derechos legales ni solicitudes de reembolso que sigan vigentes.
        </p>
      </section>

      <section>
        <h2>8. Responsabilidad y ley aplicable</h2>
        <p>
          En la medida permitida por la ley, Teilen Teens no será responsable por daños indirectos derivados de la imposibilidad de usar el servicio o de decisiones personales tomadas únicamente sobre la base de un resultado. Nada en estos términos limita derechos irrenunciables del consumidor ni excluye responsabilidades que no puedan excluirse legalmente.
        </p>
        <p>
          Estos términos se interpretan conforme a las leyes aplicables en Argentina. Si sos consumidor, conservás las protecciones y vías de reclamo obligatorias que te correspondan en tu lugar de residencia.
        </p>
      </section>

      <section>
        <h2>9. Contacto y actualizaciones</h2>
        <p>
          Para consultas sobre estos términos, escribinos a <a href="mailto:hola@simplelifemindset.com">hola@simplelifemindset.com</a>. Podemos actualizar esta página; la fecha al comienzo indica la revisión más reciente. Los cambios materiales se comunicarán por medios razonables.
        </p>
      </section>
    </LegalPage>
  );
}
