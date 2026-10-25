"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import {
  deleteMinorProfile,
  saveMinorProfile,
  type MinorProfile,
} from "@/_actions/minor-profiles";

type Draft = Pick<MinorProfile, "id" | "fullName" | "birthYear" | "schoolName" | "relationship">;

export function MinorProfilesSection({
  profiles,
  loadError,
}: {
  profiles: MinorProfile[];
  loadError: string | null;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const startNew = () => {
    setError(null);
    setDraft({ id: "", fullName: "", birthYear: new Date().getFullYear() - 13, schoolName: "", relationship: "" });
  };

  const startEdit = (profile: MinorProfile) => {
    setError(null);
    setDraft({
      id: profile.id,
      fullName: profile.fullName,
      birthYear: profile.birthYear,
      schoolName: profile.schoolName,
      relationship: profile.relationship,
    });
  };

  const handleSave = async (formData: FormData) => {
    setSaving(true);
    setError(null);
    setNotice(null);
    const result = await saveMinorProfile(formData);
    setSaving(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    setDraft(null);
    setNotice(result.warning ?? null);
    router.refresh();
  };

  const handleDelete = async (profile: MinorProfile) => {
    if (!window.confirm(`¿Eliminar el perfil de ${profile.fullName}? Los informes ya creados conservarán la información registrada para esa evaluación.`)) return;
    setError(null);
    setNotice(null);
    const result = await deleteMinorProfile(profile.id);
    if (!result.success) {
      setError(result.error);
      return;
    }
    setNotice(result.warning ?? null);
    router.refresh();
  };

  return (
    <section id="dashboard-minors" className="mt-7 rounded-[26px] border border-[#141b3c]/10 bg-white p-5 shadow-[0_16px_45px_-36px_rgba(20,27,60,.5)] sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[.18em] text-[#e46a12]">Perfiles a tu cargo</p>
          <h2 className="text-lg font-bold text-[#141b3c]">Menores</h2>
          <p className="mt-1 max-w-2xl text-sm text-[#545c7e]">
            Añade los datos de cada menor. Podrás elegir para quién iniciar cada evaluación; cada informe conserva una copia de los datos usados al comenzar.
          </p>
        </div>
      </div>

          {loadError && (
            <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              No se pudieron cargar los perfiles: {loadError}
            </p>
          )}

      {error && (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
      {notice && (
        <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800" role="status">
          {notice}
        </p>
      )}

      {draft && (
        <form action={handleSave} className="mt-5 rounded-2xl border border-[#141b3c]/10 bg-[#fffaf5] p-4 sm:p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-[#141b3c]">{draft.id ? "Editar perfil" : "Añadir menor"}</h3>
              <p className="mt-1 text-xs text-[#545c7e]">Los campos con * son obligatorios.</p>
            </div>
            <button type="button" onClick={() => setDraft(null)} aria-label="Cerrar formulario" className="rounded-full p-2 text-[#545c7e] hover:bg-white">
              <X className="h-4 w-4" />
            </button>
          </div>
          <input type="hidden" name="minor_id" value={draft.id} />
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5 text-sm font-medium text-[#141b3c]">
              Nombre completo *
              <input
                name="full_name"
                required
                maxLength={120}
                defaultValue={draft.fullName}
                className="h-11 rounded-xl border border-[#141b3c]/15 bg-white px-3 text-sm outline-none focus:border-[#f27a1a]"
              />
            </label>
            <label className="grid gap-1.5 text-sm font-medium text-[#141b3c]">
              Año de nacimiento *
              <input
                name="birth_year"
                type="number"
                required
                min="1900"
                max={new Date().getFullYear()}
                defaultValue={draft.birthYear}
                className="h-11 rounded-xl border border-[#141b3c]/15 bg-white px-3 text-sm outline-none focus:border-[#f27a1a]"
              />
            </label>
            <label className="grid gap-1.5 text-sm font-medium text-[#141b3c]">
              Vínculo con el menor *
              <input
                name="relationship"
                required
                maxLength={80}
                placeholder="Madre, padre, tutor/a, familiar…"
                defaultValue={draft.relationship}
                className="h-11 rounded-xl border border-[#141b3c]/15 bg-white px-3 text-sm outline-none focus:border-[#f27a1a]"
              />
            </label>
            <label className="grid gap-1.5 text-sm font-medium text-[#141b3c]">
              Colegio
              <input
                name="school_name"
                maxLength={160}
                defaultValue={draft.schoolName ?? ""}
                className="h-11 rounded-xl border border-[#141b3c]/15 bg-white px-3 text-sm outline-none focus:border-[#f27a1a]"
              />
            </label>
            <label className="grid gap-1.5 text-sm font-medium text-[#141b3c] sm:col-span-2">
              Foto (opcional)
              <input
                name="image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="rounded-xl border border-[#141b3c]/15 bg-white px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-[#fff3cf] file:px-3 file:py-1.5 file:font-semibold file:text-[#141b3c]"
              />
              <span className="text-xs font-normal text-[#545c7e]">JPG, PNG o WebP, máximo 5 MB. Solo tú puedes acceder a esta foto.</span>
            </label>
          </div>
          <label className="mt-4 flex items-start gap-2.5 text-xs leading-relaxed text-[#545c7e]">
            <input name="guardian_authorized" type="checkbox" required className="mt-0.5 accent-[#f27a1a]" />
            <span>Confirmo que soy una persona adulta autorizada para compartir y gestionar estos datos del menor.</span>
          </label>
          <button
            type="submit"
            disabled={saving}
            className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-[#f27a1a] px-5 text-sm font-semibold text-white shadow-[3px_3px_0_#141b3c] disabled:opacity-60"
          >
            {saving ? "Guardando…" : "Guardar perfil"}
          </button>
        </form>
      )}

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {profiles.map((profile) => (
          <article key={profile.id} className="rounded-2xl border border-[#141b3c]/10 bg-[#fffaf5] p-4">
            <div className="flex items-start gap-3">
              {profile.avatarUrl ? (
                // Signed URLs keep minor photos private and are refreshed with the dashboard data.
                <img src={profile.avatarUrl} alt={`Foto de ${profile.fullName}`} className="h-14 w-14 rounded-2xl object-cover" />
              ) : (
                <div aria-hidden="true" className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#fff3cf] text-lg font-bold text-[#e46a12]">
                  {profile.fullName.slice(0, 1).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold text-[#141b3c]">{profile.fullName}</h3>
                <p className="mt-0.5 text-xs text-[#545c7e]">Nacimiento: {profile.birthYear}</p>
                <p className="mt-1 text-xs text-[#545c7e]">{profile.relationship}</p>
              </div>
              <div className="flex gap-1">
                <button type="button" onClick={() => startEdit(profile)} aria-label={`Editar perfil de ${profile.fullName}`} className="rounded-lg p-2 text-[#545c7e] hover:bg-white hover:text-[#141b3c]">
                  <Pencil className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => void handleDelete(profile)} aria-label={`Eliminar perfil de ${profile.fullName}`} className="rounded-lg p-2 text-[#545c7e] hover:bg-red-50 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            {profile.schoolName && <p className="mt-3 border-t border-[#141b3c]/10 pt-3 text-xs text-[#545c7e]">Colegio: {profile.schoolName}</p>}
          </article>
        ))}

        {!draft && (
          <button
            type="button"
            onClick={startNew}
            className="flex min-h-28 items-center justify-center gap-2 rounded-2xl border border-dashed border-[#e46a12]/45 bg-white text-sm font-semibold text-[#e46a12] transition hover:bg-[#fffaf5]"
          >
            <Plus className="h-5 w-5" />
            Añadir menor
          </button>
        )}
      </div>
    </section>
  );
}
