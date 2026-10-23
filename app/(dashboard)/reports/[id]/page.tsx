import { getReportDetail } from "@/_actions/reports";

import { ReportView } from "@/app/components/reports/report-view";
import { ReportGenerating } from "@/app/components/reports/report-generating";
import Checkout from "@/app/components/payments/checkout";

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
      <div className="mx-auto w-full max-w-2xl px-6 py-16">
        <div className="callout">
          <span className="ic" aria-hidden="true">
            !
          </span>
          <p>{result.error}</p>
        </div>
      </div>
    );
  }

  const report = result.data;

  // Case 1.5: still being generated. Show the waiting screen regardless of
  // access — previously an un-unlocked user landed on the paywall copy
  // ("tu informe está listo") while nothing had actually been generated.
  if (report.status === "pending" || report.status === "generating") {
    return (
      <div className="mx-auto w-full max-w-2xl px-6 py-10">
        <ReportGenerating reportId={report.id} />
      </div>
    );
  }

  // Case 2: user does NOT have access → full-page checkout + code dialog.
  // The heading lives inside <Checkout/> so the two panels run edge to edge.
  if (!report.hasAccess) {
    return <Checkout reportId={report.id} />;
  }

  // Case 3: user HAS access → render report
  return (
    <div className="mx-auto w-full px-6 py-10">
      <ReportView initial={report} />
    </div>
  );
}