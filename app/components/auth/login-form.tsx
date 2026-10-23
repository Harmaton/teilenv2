"use client"

import { useActionState, useState } from "react"
import { useFormStatus } from "react-dom"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import GoogleAuthButton from "./google-oauth"
import { login, type LoginState } from "@/_actions/auth"

const initialState: LoginState = { success: false, error: null }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      disabled={pending}
      className="h-12 rounded-2xl bg-[#f27a1a] text-sm font-semibold text-[#141b3c] shadow-[4px_4px_0_#141b3c] hover:bg-[#ff8a2b] hover:shadow-[5px_5px_0_#141b3c] focus-visible:ring-[#f27a1a] dark:bg-[#f27a1a] dark:text-[#141b3c] dark:hover:bg-[#ff8a2b]"
    >
      {pending ? "Iniciando sesión..." : "Iniciar sesión"}
    </Button>
  )
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [state, formAction] = useActionState(login, initialState)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <form className={cn("flex flex-col gap-7", className)} action={formAction} {...props}>
      <FieldGroup className="gap-5">
        <div className="flex flex-col gap-2 text-left">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-[#e46a12]">Bienvenido de vuelta</p>
          <h1 className="text-3xl font-bold tracking-tight text-[#141b3c]">Inicia sesión</h1>
          <p className="text-sm leading-relaxed text-[#545c7e]">
            Continúa tu recorrido de autoconocimiento y vuelve a tus resultados.
          </p>
        </div>

        {state.error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {state.error}
          </p>
        )}

        <Field>
          <FieldLabel className="text-sm font-semibold text-[#141b3c]" htmlFor="email">Correo electrónico</FieldLabel>
          <Input id="email" name="email" type="email" placeholder="correo@ejemplo.com" required className="h-12 rounded-xl border-[#141b3c]/15 bg-white px-4 text-[#141b3c] placeholder:text-[#545c7e]/60 focus-visible:border-[#f27a1a] focus-visible:ring-[#f27a1a]/25" />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel className="text-sm font-semibold text-[#141b3c]" htmlFor="password">Contraseña</FieldLabel>
              <Link href="/forgot-password" className="ml-auto text-sm font-medium text-[#e46a12] underline-offset-4 hover:underline">
              ¿Olvidaste tu contraseña?
              </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              className="pr-10"
              aria-label="Contraseña"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-[#545c7e] hover:bg-[#f6f5fb] hover:text-[#141b3c]"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </Field>
        <Field>
          <SubmitButton />
        </Field>
          <FieldSeparator className="text-xs text-[#545c7e] before:bg-[#141b3c]/10 after:bg-[#141b3c]/10">O continúa con</FieldSeparator>
        <Field>
          <GoogleAuthButton />
          <FieldDescription className="text-center">
            ¿No tienes una cuenta?{" "}
            <Link href="/signup" className="font-semibold text-[#e46a12] underline underline-offset-4">
              Regístrate
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}