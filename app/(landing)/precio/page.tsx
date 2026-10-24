import type { Metadata } from "next";
import { PricingPage } from "@/components/new-landing-page/policy-page";

export const metadata: Metadata = {
  title: "Precio | Teilen Teens",
  description: "Conoce el precio y lo que incluye el informe completo de Identidad Evolutiva de Teilen Teens.",
};

export default function Page() {
  return <PricingPage />;
}
