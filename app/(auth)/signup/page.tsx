
import SignupForm from "@/app/components/auth/signup-form"
import { AuthPageLayout } from "@/app/components/auth/auth-page-layout"

export default function SignupPage() {
  return (
    <AuthPageLayout imageSrc="/auth/sp2.png" imageAlt="Ilustración de un recorrido de aprendizaje" context="Empieza tu recorrido">
      <SignupForm />
    </AuthPageLayout>
  )
}

