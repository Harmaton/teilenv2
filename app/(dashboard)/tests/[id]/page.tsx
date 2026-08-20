import { getTestWithAttempt } from "@/_actions/test-attempts";
import { TestRunner } from "@/app/components/tests/test-runner";

export default async function TestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getTestWithAttempt(id);

  console.log(JSON.stringify(result))

  if (!result.success) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <p className="text-[14px] text-black/50">{result.error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <TestRunner test={result.test} attempt={result.attempt} />
    </div>
  );
}