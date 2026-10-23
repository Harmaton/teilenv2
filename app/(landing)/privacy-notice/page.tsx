import type { Metadata } from "next";
import { PrivacyPolicyPage } from "@/components/new-landing-page/policy-page";

export const metadata: Metadata = {
  title: "Privacidad | Teilen Teens",
  description: "Qué información recoge Teilen Teens, para qué la usa, quién puede acceder y cuáles son tus derechos.",
};

export default function Page() {
  return <PrivacyPolicyPage />;
}
