import VerifyOtpForm from "@/app/components/auth/verify-otp-form";
import { AuthPageLayout } from "@/app/components/auth/auth-page-layout";

export default function VerifyOtpPage() {
  return (
    <AuthPageLayout imageSrc="/auth/otp.png" imageAlt="Ilustración de verificación segura" context="Un paso más para empezar">
      <VerifyOtpForm />
    </AuthPageLayout>
  );
}