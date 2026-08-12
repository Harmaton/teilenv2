import { getPublishedTests } from "@/_actions/tests";
import { TestsTabs } from "@/app/components/tests/test-tab";

export default async function TestsPage() {
  const result = await getPublishedTests();

  const free = result.success ? result.data.free : [];
  const paid = result.success ? result.data.paid : [];

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold text-black">Tests</h1>
        <p className="mt-1 text-[13px] text-black/45">
          Choose a test to start a new attempt.
        </p>
      </div>

      <TestsTabs free={free} paid={paid} />

      {!result.success && (
        <p className="mt-6 text-[13px] text-red-600">
          No pudimos cargar los tests. Intenta de nuevo.
        </p>
      )}
    </div>
  );
}