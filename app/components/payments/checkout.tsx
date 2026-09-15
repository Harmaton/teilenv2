import Image from "next/image";
import { Lock, ShieldCheck, BadgeCheck, CreditCard, RotateCcw } from "lucide-react";
import EmbeddedHotmartCheckout from "./embedded-hotmart";
import { CodeDialog } from "./free/code-dialog";

const Checkout = ({ reportId }: { reportId?: string }) => {
  return (
    <div className="mt-6 w-full max-w-md mx-auto rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 px-6 py-6 text-center">
        <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-medium tracking-wide text-white/90 uppercase">
          Reporte Premium
        </span>
        <h3 className="mt-3 text-xl font-semibold text-white">
          Desbloquea tu Reporte Completo
        </h3>
        <p className="mt-1 text-sm text-white/60">
          Acceso instantáneo después del pago
        </p>
      </div>

      {/* Body */}
      <div className="px-6 py-6">
        {/* Benefits */}
        <ul className="mb-6 space-y-2 text-sm text-gray-700">
          {[
            "Reporte completo y detallado, desbloqueado al instante",
            "PDF descargable que podrás conservar para siempre",
            "Soporte prioritario por correo electrónico",
          ].map((benefit) => (
            <li key={benefit} className="flex items-start gap-2">
              <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>

        {/* Checkout button */}
        <div className="mb-3">
          <EmbeddedHotmartCheckout />
        </div>

        {/* Money-back guarantee */}
        <div className="mb-5 flex items-center justify-center gap-1.5 text-xs text-gray-500">
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Garantía de devolución de 7 días, sin preguntas</span>
        </div>

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-gray-400">o</span>
          </div>
        </div>

        {/* Free code option */}
        <div className="flex justify-center">
          <CodeDialog reportId={reportId} />
        </div>

        {/* Trust / payment protection */}
        <div className="mt-6 border-t border-gray-100 pt-5">
          <div className="flex items-center justify-center gap-4 text-gray-400">
            <div className="flex items-center gap-1 text-xs">
              <Lock className="h-3.5 w-3.5" />
              <span>Conexión Segura SSL</span>
            </div>
            <div className="h-3 w-px bg-gray-200" />
            <div className="flex items-center gap-1 text-xs">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Compra Protegida</span>
            </div>
            <div className="h-3 w-px bg-gray-200" />
            <div className="flex items-center gap-1 text-xs">
              <CreditCard className="h-3.5 w-3.5" />
              <span>Pago Encriptado</span>
            </div>
          </div>
          <p className="mt-3 text-center text-[11px] text-gray-400">
            Visa · Mastercard · PayPal · Procesado de forma segura por Hotmart
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;