import type { Metadata } from "next";
import { RefundPolicyPage } from "@/components/new-landing-page/policy-page";

export const metadata: Metadata = {
  title: "Política de reembolso | Teilen Teens",
  description: "Condiciones para solicitar un reembolso por compras digitales en Teilen Teens.",
};

export default function Page() {
  return <RefundPolicyPage />;
}
