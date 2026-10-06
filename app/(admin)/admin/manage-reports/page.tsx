import { getReportsGroupedByUser } from "@/_actions/admin-reports";
import { AdminReportsList } from "../../_components/admin-reports-list";

export default async function ManageReportsPage() {
  const result = await getReportsGroupedByUser();

  if (!result.success) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <p className="text-[13px] text-red-600">{result.error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold text-black">Informes</h1>
        <p className="mt-1 text-[13px] text-black/45">Informes generados por usuario.</p>
      </div>

      <AdminReportsList groups={result.data} />
    </div>
  );
}