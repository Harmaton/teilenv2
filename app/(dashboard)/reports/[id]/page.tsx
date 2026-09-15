
import { getReportDetail } from "@/_actions/reports";
import Checkout from "@/app/components/payments/checkout";
import { ReportView } from "@/app/components/reports/report-view";


export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getReportDetail(id);

  // Case 1: not found / not owned
  if (!result.success) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <p className="text-[14px] text-black/50">{result.error}</p>
      </div>
    );
  }

  const report = result.data;

  // Case 2: user does NOT have access → show checkout + code dialog
  if (!report.hasAccess) {
    return (
      <div className="mx-auto w-full max-w-xl px-6 py-10">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Tu informe está listo 🎉
          </h1>
          <p className="text-gray-600 mt-2">
            Desbloquea tu informe completo para ver los resultados.
          </p>
        </div>

        {/* Paid option + free code option, both rendered inside Checkout */}
        <Checkout reportId={report.id} />
      </div>
    );
  }

  // Case 3: user HAS access → render report
  return (
    <div className="mx-auto w-full px-6 py-10">
      <ReportView initial={report} />
    </div>
  );
}