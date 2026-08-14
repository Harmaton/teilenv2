// Path: app/(admin)/admin/manage-reports/[id]/page.tsx
import { getReportDetailAdmin } from "@/_actions/admin-reports";
import { AdminReportView } from "../../_components/report-view-admin";


export default async function AdminReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getReportDetailAdmin(id);

  if (!result.success) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <p className="text-[14px] text-black/50">{result.error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full px-6 py-10">
      <AdminReportView initial={result.data} />
    </div>
  );
}