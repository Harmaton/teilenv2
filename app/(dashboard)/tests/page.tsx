import { getPublishedTests } from "@/_actions/tests";
import { getProfileValuesStrengths } from "@/_actions/profile";
import { TestsTabs } from "@/app/components/tests/test-tab";

export default async function TestsPage() {
  const [testsResult, valuesResult] = await Promise.all([
    getPublishedTests(),
    getProfileValuesStrengths(),
  ]);

  const free = testsResult.success ? testsResult.data.free : [];
  const paid = testsResult.success ? testsResult.data.paid : [];
  const values = valuesResult.success ? valuesResult.data.values : [];
  const strengths = valuesResult.success ? valuesResult.data.strengths : [];

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold text-black">Pruebas</h1>
        <p className="mt-1 text-[13px] text-black/45">
          Elige una prueba para iniciar un nuevo intento.
        </p>
      </div>

      <TestsTabs free={free} paid={paid} initialValues={values} initialStrengths={strengths} />

      {!testsResult.success && (
        <p className="mt-6 text-[13px] text-red-600">
          No pudimos cargar los tests. Intenta de nuevo.
        </p>
      )}
    </div>
  );
}