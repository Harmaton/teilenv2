import Image from "next/image";
import { FileText, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import PaddleCheckoutButton from "./paddle-checkout-button";
import { CodeDialog } from "./free/code-dialog";

/*
  Full-page checkout in the Teilen Teens 4.0 system.
  Relies on global tokens/classes: --ink, --orange, --sun, --lilac, --paper,
  .sticker, .chip, .callout, .checks, .ticket-price, .h1, .h3, .lead, .hl, .dots-ink
*/

const reportPages = [
  ["reporte-0.webp", "Mapa de identidad"],
  ["reporte-1.webp", "Quién soy hoy"],
  ["reporte-2.webp", "Cómo funciono"],
  ["reporte-3.webp", "Dónde aporto valor"],
  ["reporte-4.webp", "Proyecto de vida"],
];

const included = [
  "Informe completo en PDF de 5 páginas",
  "5 preguntas con Salomón IA sobre tu informe",
  "Acceso desde tu espacio personal",
  "Un pago único; sin suscripción recurrente",
];

const Checkout = ({ reportId }: { reportId?: string }) => (
  <section className="w-full bg-white lg:min-h-[calc(100dvh-78px)]">
    <div className="grid lg:min-h-[inherit] lg:grid-cols-[1.1fr_.9fr]">
      {/* ───────── Left: what you get ───────── */}
      <div className="dots-ink flex flex-col justify-center bg-[var(--lilac)] px-5 py-10 sm:px-10 lg:border-r-2 lg:border-[var(--ink)] lg:px-14 lg:py-14">
        <div className="mx-auto w-full max-w-xl">
          <span className="sticker orange">
            <Sparkles /> Tu informe está listo
          </span>

          <h1
            className="h1 mt-6"
            style={{ fontSize: "clamp(2.2rem,4.4vw,3.6rem)" }}
          >
            Una mirada más completa sobre{" "}
            <span className="hl">quién eres hoy.</span>
          </h1>
          <p className="lead mt-4">
            Desbloquea tu Identidad Evolutiva para conservar el informe y seguir
            explorando tus resultados con Salomón IA.
          </p>

          <div className="mt-9 grid grid-cols-[minmax(130px,.8fr)_1fr] items-center gap-6 sm:gap-9">
            <div className="relative mx-auto w-full max-w-[230px] -rotate-3 rounded-[14px] border-4 border-white bg-white shadow-[8px_10px_0_var(--orange),0_24px_40px_-22px_rgba(20,27,60,.5)]">
              <Image
                src="/assets/reporte-0.webp"
                alt="Portada del informe de ejemplo ficticio"
                width={708}
                height={1000}
                className="h-auto w-full rounded-[10px]"
              />
              <span className="sticker absolute -right-4 -top-4 !bg-[var(--sun)]">
                Ejemplo
              </span>
            </div>

            <div>
              <h2 className="h3 mb-4">5 páginas para explorar</h2>
              <ol className="m-0 grid list-none gap-2.5 p-0">
                {reportPages.map(([image, title], index) => (
                  <li
                    key={image}
                    className="flex items-center gap-3 rounded-full border-2 border-[var(--ink)] bg-white py-1.5 pl-1.5 pr-4 text-sm font-semibold text-[var(--ink)]"
                  >
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 border-[var(--ink)] bg-[var(--sun)] text-xs font-extrabold font-[family-name:var(--font-display)]">
                      {index + 1}
                    </span>
                    {title}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="callout mt-8">
            <span className="ic">
              <FileText />
            </span>
            <p className="small">
              Ejemplo ficticio de Mateo. Tu informe se genera a partir de tus
              propias respuestas.
            </p>
          </div>
        </div>
      </div>

      {/* ───────── Right: purchase ───────── */}
      <div className="flex flex-col justify-center bg-[var(--paper)] px-5 py-10 sm:px-10 lg:px-14 lg:py-14">
        <div className="mx-auto w-full max-w-md">
          <span className="chip">
            <ShieldCheck className="h-4 w-4 text-[var(--orange-deep)]" />
            Compra protegida
          </span>

          <h2
            className="h3 mt-5"
            style={{ fontSize: "clamp(1.5rem,2.4vw,1.9rem)" }}
          >
            Identidad Evolutiva completa
          </h2>

          <div className="ticket-price !mb-0 !mt-4">
            <small>USD</small>
            <b>50</b>
            <span className="self-end pb-1 text-sm font-semibold tracking-normal text-[var(--muted)]">
              pago único
            </span>
          </div>

          <div className="my-6 border-t-[2.5px] border-dashed border-[var(--ink)]" />

          <ul className="checks">
            {included.map((benefit) => (
              <li key={benefit}>
                <span className="font-semibold">{benefit}</span>
              </li>
            ))}
          </ul>

          {/* Inner button should use: "btn btn-primary btn-full" */}
          <div className="mt-7">
            <PaddleCheckoutButton reportId={reportId} />
          </div>

          <p className="tiny mt-4 flex items-start gap-2">
            <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-[var(--orange-deep)]" />
            Antes de confirmar, revisa el total final, la moneda, los impuestos
            y las condiciones que aparecen en el checkout.
          </p>

          <div className="my-6 flex items-center gap-3 text-sm font-bold text-[var(--muted)]">
            <span className="h-0.5 flex-1 rounded bg-[var(--ink)]/15" />
            ¿Tienes un código?
            <span className="h-0.5 flex-1 rounded bg-[var(--ink)]/15" />
          </div>

          {/* Trigger should use: "btn btn-white btn-full" */}
          <CodeDialog reportId={reportId} />

          <p className="tiny mt-4 text-center">
            La evaluación inicial es gratuita. El informe se desbloquea solo si
            decides comprarlo.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default Checkout;