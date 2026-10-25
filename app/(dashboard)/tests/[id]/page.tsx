import { getTestWithAttempt } from "@/_actions/test-attempts";
import { TestRunner } from "@/app/components/tests/test-runner";
import { getMinorProfiles } from "@/_actions/minor-profiles";
import Link from "next/link";

export default async function TestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [result, minorsResult] = await Promise.all([
    getTestWithAttempt(id),
    getMinorProfiles(),
  ]);

  if (!result.success) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <p className="text-[14px] text-black/50">{result.error}</p>
        {result.error.includes("edad") && (
          <Link
            href="/settings"
            className="mt-5 inline-flex rounded-full bg-orange-500 px-5 py-2.5 text-[13px] font-semibold text-white"
          >
            Completar perfil
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      {!minorsResult.success && (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          No se pudieron cargar los perfiles de menores: {minorsResult.error}
        </p>
      )}
      <TestRunner
        test={result.test}
        attempt={result.attempt}
        minorProfiles={minorsResult.success ? minorsResult.data : []}
      />
    </div>
  );
}