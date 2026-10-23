import type { Metadata } from "next";
import CommunityPage from "@/components/new-landing-page/community-page";

export const metadata: Metadata = {
  title: "Comunidad Teilen: afiliados, mentores y creadores",
  description: "Participa en Teilen como afiliado, mentor, joven creador o representante institucional. Cada modalidad tiene reglas y procesos propios.",
};

export default function Page() {
  return <CommunityPage />;
}
