import { getUserProfile } from "@/_actions/profile";
import { getUserSettings } from "@/_actions/settings";
import SettingsTabs from "./settings-tabs";

export default async function SettingsPage() {
  const [profileResult, settingsResult] = await Promise.all([
    getUserProfile(),
    getUserSettings(),
  ]);

  if (!profileResult.success || !settingsResult.success) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700">
          <p className="font-semibold">No se pudo cargar la configuración.</p>
          {/* <p className="mt-2">
            {profileResult.error ?? settingsResult.error}
          </p> */}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold text-black">Configuración</h1>
        <p className="mt-1 text-[13px] text-black/45">
          Administra tu perfil y las preferencias del panel desde un solo lugar.
        </p>
      </div>
      <SettingsTabs
        profile={profileResult.data}
        settings={settingsResult.data}
      />
    </div>
  );
}
