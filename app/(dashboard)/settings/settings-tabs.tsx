"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import ProfileForm from "@/app/(dashboard)/profile/profile-form";
import SettingsForm from "./settings-form";

const ACCENT = "#FF5A1F";

type SettingsTabsProps = {
  profile: {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    role: string | null;
    is_active: boolean;
  };
  settings: {
    theme: "auto" | "light" | "dark";
    emailNotifications: boolean;
    helpTips: boolean;
  };
};

type TabKey = "profile" | "preferences";

export default function SettingsTabs({ profile, settings }: SettingsTabsProps) {
  const [tab, setTab] = useState<TabKey>("profile");

  return (
    <div className="relative">
      <div className="mb-6 inline-flex items-center gap-1 rounded-full border border-black/[0.06] bg-black/[0.02] p-1">
        <TabButton active={tab === "profile"} onClick={() => setTab("profile") }>
          Perfil
        </TabButton>
        <TabButton active={tab === "preferences"} onClick={() => setTab("preferences") }>
          Preferencias
        </TabButton>
      </div>

      <div className="rounded-3xl border border-black/[0.08] bg-white p-0">
        <div className="overflow-hidden rounded-3xl">
          {tab === "profile" ? (
            <ProfileForm
              email={profile.email}
              full_name={profile.full_name}
              avatar_url={profile.avatar_url}
              role={profile.role}
              is_active={profile.is_active}
              userId={profile.id}
            />
          ) : (
            <SettingsForm
              theme={settings.theme}
              emailNotifications={settings.emailNotifications}
              helpTips={settings.helpTips}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors",
        active ? "text-white" : "text-black/50 hover:text-black"
      )}
      style={active ? { backgroundColor: ACCENT } : undefined}
    >
      {children}
    </button>
  );
}
