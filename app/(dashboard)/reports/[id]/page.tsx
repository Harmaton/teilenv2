import { getReportDetail } from "@/_actions/reports";
import { ReportView } from "@/app/components/reports/report-view";


export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getReportDetail(id);

  if (!result.success) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <p className="text-[14px] text-black/50">{result.error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <ReportView initial={result.data} />
    </div>
  );
}