import { LoginForm } from "@/app/components/auth/login-form"
import { AuthPageLayout } from "@/app/components/auth/auth-page-layout"

export default function LoginPage() {
  return (
    <AuthPageLayout context="Tu informe empieza conociéndote">
      <LoginForm />
    </AuthPageLayout>
  )
}
