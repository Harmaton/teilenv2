import { getUserProfile } from "@/_actions/profile";
import ProfileForm from "./profile-form";

export default async function ProfilePage() {
  const profileResult = await getUserProfile();

  if (!profileResult.success) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700">
          <p className="font-semibold">No se pudo cargar tu perfil.</p>
          <p className="mt-2">{profileResult.error}</p>
        </div>
      </div>
    );
  }

  const profile = profileResult.data;

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold text-black">Perfil</h1>
        <p className="mt-1 text-[13px] text-black/45">
          Revisa y actualiza tu información de cuenta para mantener tu panel alineado.
        </p>
      </div>
      <ProfileForm
        email={profile.email}
        full_name={profile.full_name}
        avatar_url={profile.avatar_url}
        role={profile.role}
        is_active={profile.is_active}
      />
    </div>
  );
}
