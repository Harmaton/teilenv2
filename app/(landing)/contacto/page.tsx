import type { Metadata } from "next";
import ContactPage from "@/components/new-landing-page/contact-page";

export const metadata: Metadata = {
  title: "Contacto | Teilen Teens",
  description: "Escríbele al equipo de Teilen Teens por correo o WhatsApp: instituciones, alianzas, Werden, mentorías, Embajadores de Talento, Mecenas o soporte de compra.",
};

export default function Page() {
  return <ContactPage />;
}
