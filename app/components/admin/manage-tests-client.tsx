"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TestRow } from "@/_actions/admin-tests";
import { deleteTest } from "@/_actions/admin-tests";
import { Edit2, Trash2, Eye, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

const ACCENT = "#FF5A1F";

export function ManageTestsClient({ tests: initialTests }: { tests: TestRow[] }) {
  const router = useRouter();
  const [tests, setTests] = useState(initialTests);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dismissedError, setDismissedError] = useState(false);

  const handleDelete = async (testId: string) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este test? Esta acción no se puede deshacer.")) {
      return;
    }

    setDeletingId(testId);

    const result = await deleteTest(testId);

    setDeletingId(null);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setTests(tests.filter((t) => t.id !== testId));
  };

  return (
    <div className="space-y-4">
      {/* Error Toast */}
      {error && !dismissedError && (
        <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <span className="text-red-700">{error}</span>
            <button
              type="button"
              className="text-sm font-semibold uppercase tracking-[0.24em] text-black/50 hover:text-black"
              onClick={() => setDismissedError(true)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Tests Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tests.map((test) => (
          <div
            key={test.id}
            className="rounded-2xl border border-black/[0.08] bg-white p-5 transition hover:border-black/[0.14]"
          >
            {/* Header */}
            <div className="mb-3 flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-black">{test.title}</h3>
                {test.description && (
                  <p className="mt-1 line-clamp-1 text-xs text-black/60">{test.description}</p>
                )}
              </div>
              <div className="flex gap-2">
                {test.is_published && (
                  <div
                    className="flex h-6 w-6 items-center justify-center rounded-full text-white text-xs font-bold"
                    style={{ backgroundColor: ACCENT }}
                  >
                    ✓
                  </div>
                )}
              </div>
            </div>

            {/* Meta */}
            <div className="mb-4 flex items-center gap-2 text-xs text-black/50">
              <span>{test.items.length} preguntas</span>
              {!test.is_free && (
                <>
                  <span>·</span>
                  <span style={{ color: ACCENT }} className="font-medium">
                    Premium
                  </span>
                </>
              )}
            </div>

            {/* Badges */}
            <div className="mb-4 flex gap-2">
              {test.is_published ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                  <Eye className="h-3 w-3" />
                  Publicado
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">
                  <Lock className="h-3 w-3" />
                  Borrador
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Link
                href={`/admin/manage-tests/new?id=${test.id}`}
                className="flex-1 rounded-lg border border-black/[0.08] bg-white px-3 py-2 text-xs font-semibold text-black transition hover:bg-black/[0.02]"
              >
                <Edit2 className="h-4 w-4 inline mr-1" />
                Editar
              </Link>

              <button
                onClick={() => handleDelete(test.id)}
                disabled={deletingId === test.id}
                className="flex-1 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4 inline mr-1" />
                {deletingId === test.id ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
