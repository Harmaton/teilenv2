"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { createTest, getTestById } from "@/_actions/admin-tests";
import { initializeTest, createNewTest } from "@/store/slices/testSlice";
import { TestBuilder } from "@/app/components/admin/test-builder";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

export default function NewTestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  const testId = searchParams.get("id");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initializeTestState() {
      setLoading(true);
      setError(null);

      if (testId) {
        // Load existing test
        const result = await getTestById(testId);

        if (!result.success) {
          setError(result.error);
          setLoading(false);
          return;
        }

        dispatch(
          initializeTest({
            testId: result.data.id,
            title: result.data.title,
            description: result.data.description || "",
            isFree: result.data.is_free,
            questions: result.data.items,
            isPublished: result.data.is_published,
          })
        );
      } else {
        // Create new test
        const title = searchParams.get("title") || "Nuevo Test";
        const description = searchParams.get("description") || "";
        const isFree = searchParams.get("isFree") !== "false";

        const result = await createTest(title, description, isFree);

        if (!result.success) {
          setError(result.error);
          setLoading(false);
          return;
        }

        dispatch(
          createNewTest({
            testId: result.testId,
            title,
            description,
            isFree,
          })
        );
      }

      setLoading(false);
    }

    initializeTestState();
  }, [testId, searchParams, dispatch]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader className="mx-auto h-8 w-8 animate-spin text-orange-500" />
          <p className="mt-4 text-black/60">Cargando test...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-8">
          <p className="text-center font-semibold text-red-700">{error}</p>
          <div className="mt-6 text-center">
            <Button
              onClick={() => router.push("/admin/manage-tests")}
              variant="outline"
            >
              Volver a Tests
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold text-black">Crear Test</h1>
        <p className="mt-1 text-[13px] text-black/45">
          Agrega preguntas y opciones para tu test. Máximo 60 preguntas.
        </p>
      </div>

      <TestBuilder />
    </div>
  );
}
