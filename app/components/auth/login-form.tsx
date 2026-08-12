"use client"

import { useActionState, useState } from "react"
import { useFormStatus } from "react-dom"
import { Eye, EyeOff } from "lucide-react"
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
      className="bg-orange-500 text-white hover:bg-orange-600 focus-visible:ring-orange-500 dark:bg-orange-500 dark:hover:bg-orange-600"
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
    <form className={cn("flex flex-col gap-6", className)} action={formAction} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Inicia sesión en tu cuenta</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Ingresa tu correo electrónico a continuación para iniciar sesión en tu cuenta
          </p>
        </div>

        {state.error && (
          <p className="text-sm text-destructive text-center" role="alert">
            {state.error}
          </p>
        )}

        <Field>
          <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
          <Input id="email" name="email" type="email" placeholder="correo@ejemplo.com" required />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Contraseña</FieldLabel>
            <a href="/forgot-password" className="ml-auto text-sm underline-offset-4 hover:underline">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
        <FieldSeparator>O continúa con</FieldSeparator>
        <Field>
          <GoogleAuthButton />
          <FieldDescription className="text-center">
            ¿No tienes una cuenta?{" "}
            <a href="/signup" className="underline underline-offset-4">
              Regístrate
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}