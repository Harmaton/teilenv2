"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  addQuestion,
  removeQuestion,
  updateQuestionText,
  updateOptionText,
  addOption,
  removeOption,
  setSaving,
  setError,
  setLastSavedAt,
  setPublished,
  updateTitle,
} from "@/store/slices/testSlice";
import { updateTestQuestions, publishTest, updateTestTitle } from "@/_actions/admin-tests";
import { Button } from "@/components/ui/button";
import { X, Plus, Check } from "lucide-react";

const ACCENT = "#FF5A1F";

export function TestBuilder() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const state = useSelector((s: RootState) => s.testEditor);

  const [dismissedToast, setDismissedToast] = useState<string | null>(null);
  const [publishLoading, setPublishLoading] = useState(false);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);

  const [titleDraft, setTitleDraft] = useState(state.title);
  const [savingTitle, setSavingTitle] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const toastId = state.error
    ? `test-builder-error:${state.error}`
    : state.lastSavedAt
    ? "test-builder-saved"
    : null;

  const toast = toastId && toastId !== dismissedToast
    ? {
        type: state.error ? "error" : "success",
        message: state.error ?? "Cambios guardados automáticamente.",
      }
    : null;

  // Keep the local title draft in sync with Redux (e.g. once the test
  // finishes loading asynchronously), but never clobber the field while
  // the user is actively typing in it.
  useEffect(() => {
    if (!isEditingTitle) {
      setTitleDraft(state.title);
    }
  }, [state.title, isEditingTitle]);

  // Auto-save on navigation
  useEffect(() => {
    if (!state.testId) return;

    const handleBeforeUnload = async () => {
      if (state.questions.length === 0) return;

      dispatch(setSaving(true));

      const result = await updateTestQuestions(state.testId!, state.questions);

      dispatch(setSaving(false));

      if (result.success) {
        dispatch(setLastSavedAt());
      } else {
        dispatch(setError(result.error));
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [state.testId, state.questions, dispatch]);

  const handleAddQuestion = () => {
    if (state.questions.length >= 60) {
      dispatch(setError("Máximo 60 preguntas permitidas."));
      return;
    }
    dispatch(addQuestion());
  };

  const handleTitleBlur = async () => {
    setIsEditingTitle(false);

    const trimmed = titleDraft.trim();
    if (!trimmed || trimmed === state.title || !state.testId) {
      setTitleDraft(state.title); // revert if empty or unchanged
      return;
    }

    dispatch(updateTitle(trimmed));
    setSavingTitle(true);

    const result = await updateTestTitle(state.testId, trimmed);

    setSavingTitle(false);

    if (result.success) {
      dispatch(setLastSavedAt());
    } else {
      dispatch(setError('error'));
      dispatch(updateTitle(state.title)); // revert on failure
      setTitleDraft(state.title);
    }
  };

  const handlePublish = async () => {
    if (!state.testId) return;

    setPublishLoading(true);

    // First save any unsaved questions
    const saveResult = await updateTestQuestions(state.testId, state.questions);

    if (!saveResult.success) {
      dispatch(setError(saveResult.error));
      setPublishLoading(false);
      return;
    }

    // Then publish
    const publishResult = await publishTest(state.testId);

    setPublishLoading(false);

    if (publishResult.success) {
      dispatch(setPublished(true));
      dispatch(setLastSavedAt());
      setShowPublishConfirm(false);

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/admin/manage-tests");
      }, 2000);
    } else {
      dispatch(setError(publishResult.error));
    }
  };

  const invalidQuestions = state.questions.filter(
    (q) => !q.question.trim() || q.options.some((o) => !o.text.trim())
  );

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`rounded-3xl border px-4 py-3 text-sm shadow-sm transition duration-200 ${
            toast.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start justify-between gap-4">
            <span>{toast.message}</span>
            <button
              type="button"
              className="text-sm font-semibold uppercase tracking-[0.24em] text-black/50 hover:text-black"
              onClick={() => setDismissedToast(toastId)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="space-y-2 rounded-3xl border border-black/[0.08] bg-white p-6">
        <input
          type="text"
          value={titleDraft}
          onChange={(e) => setTitleDraft(e.target.value)}
          onFocus={() => setIsEditingTitle(true)}
          onBlur={handleTitleBlur}
          disabled={state.isPublished}
          placeholder="Título del test"
          className="w-full rounded-lg border border-transparent bg-transparent text-2xl font-semibold text-black focus:border-black/[0.14] focus:bg-white focus:px-2 focus:py-1 focus:outline-none disabled:cursor-not-allowed"
        />
        {savingTitle && <p className="mt-1 text-xs text-black/40">Guardando título…</p>}
        {state.description && <p className="text-sm text-black/60">{state.description}</p>}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-black/50">
            <span className="font-semibold">{state.questions.length}</span> preguntas de 60
          </div>
          {state.isPublished && (
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              <Check className="h-3 w-3" />
              Publicado
            </div>
          )}
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {state.questions.map((question, qIndex) => {
          const isInvalid = !question.question.trim() || question.options.some((o) => !o.text.trim());

          return (
            <div
              key={question.id}
              className={`rounded-3xl border p-6 transition ${
                isInvalid ? "border-red-200 bg-red-50" : "border-black/[0.08] bg-white"
              }`}
            >
              {/* Question Title */}
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-semibold uppercase tracking-[0.24em] text-black/50">
                    Pregunta {qIndex + 1}
                  </label>
                  <textarea
                    value={question.question}
                    onChange={(e) =>
                      dispatch(
                        updateQuestionText({
                          questionId: question.id,
                          text: e.target.value,
                        })
                      )
                    }
                    placeholder="Escribe tu pregunta aquí..."
                    className="mt-2 w-full resize-none rounded-lg border border-black/[0.08] bg-white px-3 py-2 text-sm text-black placeholder-black/30 focus:border-black/[0.14] focus:outline-none"
                    rows={2}
                  />
                  {!question.question.trim() && (
                    <p className="mt-1 text-xs text-red-600">La pregunta es requerida.</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    dispatch(
                      removeQuestion({
                        questionId: question.id,
                      })
                    )
                  }
                  className="text-black/50 hover:text-red-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Options */}
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/50">
                  Opciones ({question.options.length} de ∞)
                </p>
                {question.options.map((option, oIndex) => (
                  <div key={option.id} className="flex gap-2">
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) =>
                        dispatch(
                          updateOptionText({
                            questionId: question.id,
                            optionId: option.id,
                            text: e.target.value,
                          })
                        )
                      }
                      placeholder={`Opción ${oIndex + 1}`}
                      className="flex-1 rounded-lg border border-black/[0.08] bg-white px-3 py-2 text-sm text-black placeholder-black/30 focus:border-black/[0.14] focus:outline-none"
                    />
                    {question.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() =>
                          dispatch(
                            removeOption({
                              questionId: question.id,
                              optionId: option.id,
                            })
                          )
                        }
                        className="text-black/50 hover:text-red-600"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
                {question.options.some((o) => !o.text.trim()) && (
                  <p className="text-xs text-red-600">Todas las opciones deben tener texto.</p>
                )}
              </div>

              {/* Add Option Button */}
              <button
                type="button"
                onClick={() =>
                  dispatch(
                    addOption({
                      questionId: question.id,
                    })
                  )
                }
                className="mt-3 flex items-center gap-2 text-xs font-semibold text-black/50 hover:text-black"
              >
                <Plus className="h-4 w-4" />
                Agregar opción
              </button>
            </div>
          );
        })}
      </div>

      {/* Add Question Button */}
      <button
        type="button"
        onClick={handleAddQuestion}
        disabled={state.questions.length >= 60 || state.isPublished}
        className={`flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-8 font-medium transition ${
          state.questions.length >= 60 || state.isPublished
            ? "cursor-not-allowed border-black/[0.06] bg-black/[0.02] text-black/30"
            : "border-orange-500/30 text-orange-600 hover:border-orange-500/50 hover:bg-orange-50"
        }`}
      >
        <Plus className="h-5 w-5" />
        Agregar pregunta ({state.questions.length}/60)
      </button>

      {/* Footer Actions */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => {
            // Auto-save before navigating
            if (state.questions.length > 0 && state.testId) {
              dispatch(setSaving(true));
              updateTestQuestions(state.testId, state.questions).then((result) => {
                dispatch(setSaving(false));
                if (result.success) {
                  dispatch(setLastSavedAt());
                }
                router.push("/admin/manage-tests");
              });
            } else {
              router.push("/admin/manage-tests");
            }
          }}
          className="flex-1"
        >
          Volver
        </Button>

        <Button
          onClick={handlePublish}
          disabled={
            publishLoading ||
            state.isPublished ||
            state.questions.length === 0 ||
            invalidQuestions.length > 0
          }
          className="flex-1 bg-orange-500 text-white hover:bg-orange-600 focus-visible:ring-orange-500"
        >
          {publishLoading ? "Publicando..." : state.isPublished ? "Publicado" : "Publicar test"}
        </Button>
      </div>

      {/* Publish Confirmation Modal */}
      {showPublishConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="rounded-3xl bg-white p-6 max-w-sm">
            <h2 className="text-lg font-semibold text-black">¿Publicar test?</h2>
            <p className="mt-2 text-sm text-black/60">
              Una vez publicado, los usuarios podrán acceder a este test. No podrás hacer cambios después.
            </p>
            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowPublishConfirm(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handlePublish}
                disabled={publishLoading}
                className="flex-1 bg-orange-500 text-white hover:bg-orange-600"
              >
                {publishLoading ? "Publicando..." : "Publicar"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}