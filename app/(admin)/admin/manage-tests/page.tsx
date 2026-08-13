import Link from "next/link";
import { getAdminTests, deleteTest } from "@/_actions/admin-tests";
import { ManageTestsClient } from "@/app/components/admin/manage-tests-client";

export default async function ManageTestsPage() {
  const result = await getAdminTests();

  const tests = result.success ? result.data : [];

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-black">Gestionar Tests</h1>
          <p className="mt-1 text-[13px] text-black/45">
            Crea, edita y publica tus tests personalizados.
          </p>
        </div>
        <Link
          href="/admin/manage-tests/new"
          className="inline-flex items-center rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          + Nuevo Test
        </Link>
      </div>

      {tests.length === 0 ? (
        <div className="rounded-2xl border border-black/[0.06] bg-black/[0.02] px-6 py-10 text-center">
          <p className="text-[13px] text-black/45">
            No has creado ningún test todavía. ¡Crea uno para empezar!
          </p>
        </div>
      ) : (
        <ManageTestsClient tests={tests} />
      )}
    </div>
  );
}
