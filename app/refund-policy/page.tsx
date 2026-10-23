import type { Metadata } from "next";
import { LegalPage } from "@/app/legal/legal-page";

export const metadata: Metadata = {
  title: "Política de reembolso | Teilen Teens",
  description: "Condiciones para solicitar un reembolso por compras digitales en Teilen Teens.",
};

export default function RefundPolicyPage() {
  return (
    <LegalPage
      eyebrow="Compras y devoluciones"
      title="Política de reembolso"
      description="Queremos que puedas probar Teilen Teens con tranquilidad. Esta política explica cómo solicitar una devolución."
    >
      <section>
        <h2>1. Garantía voluntaria de 7 días</h2>
        <p>
          Ofrecemos una garantía de devolución de 7 días para las compras digitales pagadas directamente en Teilen Teens, incluidos los reportes premium y el acceso de pago a Teilen AI/Salomon. Podés pedir un reembolso completo dentro de los 7 días calendario posteriores a la fecha de compra, sin necesidad de justificar el motivo.
        </p>
        <p>
          Esta garantía voluntaria no limita los derechos de reembolso, desistimiento o protección al consumidor que te reconozca la legislación aplicable; esos derechos pueden tener plazos o condiciones distintos.
        </p>
      </section>

      <section>
        <h2>2. Cómo solicitarlo</h2>
        <p>
          Enviá tu solicitud a <a href="mailto:hola@simplelifemindset.com">hola@simplelifemindset.com</a> indicando el correo electrónico asociado a tu cuenta, la fecha aproximada de compra y, si está disponible, el identificador de transacción de Paddle. No envíes números completos de tarjeta ni datos financieros sensibles.
        </p>
        <p>
          Revisaremos la solicitud y te confirmaremos el estado por correo. Si la compra fue procesada por Paddle, el reembolso se enviará al método de pago original a través de Paddle. El tiempo para que aparezca en tu cuenta depende del proveedor de pago y de tu entidad financiera.
        </p>
      </section>

      <section>
        <h2>3. Acceso después del reembolso</h2>
        <p>
          Cuando se aprueba un reembolso, podemos deshabilitar el acceso al reporte, chat u otro contenido digital asociado con esa compra. Si el pago está pendiente, fue rechazado o no se completó, no se considera una compra confirmada y no se requiere una devolución.
        </p>
      </section>

      <section>
        <h2>4. Compras y cargos de terceros</h2>
        <p>
          Esta política se aplica a productos comprados mediante el checkout de Teilen Teens. Para una compra realizada en otra plataforma o por un tercero, consultá las condiciones del vendedor correspondiente. Paddle puede mostrar términos adicionales durante el pago; nada de lo indicado aquí reduce derechos obligatorios que te correspondan.
        </p>
      </section>

      <section>
        <h2>5. Contacto</h2>
        <p>
          Si tenés preguntas o no recibiste confirmación, escribinos a <a href="mailto:hola@simplelifemindset.com">hola@simplelifemindset.com</a> o contactanos por WhatsApp al <a href="https://wa.me/5435175680433">+54 3517 56-8043</a>. Incluí únicamente los datos necesarios para localizar la compra.
        </p>
      </section>
    </LegalPage>
  );
}
