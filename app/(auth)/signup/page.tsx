
import SignupForm from "@/app/components/auth/signup-form"
import { GalleryVerticalEnd } from "lucide-react"

export default function SignupPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Teilen Teens
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignupForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block p-6">
        <div className="h-full w-full overflow-hidden rounded-[2rem] bg-orange-50 shadow-[inset_0_0_0_1px_rgba(251,146,60,0.16),0_20px_50px_-30px_rgba(251,146,60,0.45)]">
          <img
            src="/auth/sp2.png"
            alt="Imagen de registro"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  )
}

