import { RotateCcw } from "lucide-react";
import EmbeddedHotmartCheckout from "./embedded-hotmart";
import { CodeDialog } from "./free/code-dialog";

const SalomonCheckout = ({ reportId }: { reportId?: string }) => {
  return (
    <div className="w-full space-y-3">
      <div>
        <p className="text-[12.5px] font-semibold text-black">Desbloquea el chat</p>
        <p className="mt-0.5 text-[11.5px] leading-relaxed text-black/50">
          Sigue preguntándole a Salomon AI sobre tu informe, sin límite.
        </p>
      </div>

      <EmbeddedHotmartCheckout />

      <div className="flex items-center justify-center gap-1.5 text-[10.5px] text-black/40">
        <RotateCcw className="h-3 w-3" />
        <span>Garantía de devolución de 7 días</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-black/[0.08]" />
        <span className="text-[10px] uppercase tracking-wide text-black/30">o</span>
        <div className="h-px flex-1 bg-black/[0.08]" />
      </div>

      <div className="flex justify-center">
        <CodeDialog reportId={reportId} />
      </div>
    </div>
  );
};

export default SalomonCheckout;