import Link from "next/link";
import type { ReactNode } from "react";

const policies = [
  { href: "/terms-of-service", label: "Términos del servicio" },
  { href: "/privacy-notice", label: "Aviso de privacidad" },
  { href: "/refund-policy", label: "Política de reembolso" },
];

export function LegalPage({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#0a0e1a] px-5 py-8 text-white sm:px-8 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <Link href="/" className="text-lg font-bold tracking-tight">
            Teilen <span className="text-[#FF7A33]">Teens</span>
          </Link>
          <Link
            href="/"
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 transition hover:border-[#FF7A33]/60 hover:text-white"
          >
            Volver al inicio
          </Link>
        </header>

        <div className="grid gap-10 py-10 md:grid-cols-[minmax(0,1fr)_220px] md:gap-14 md:py-16">
          <article className="min-w-0">
            <div className="mb-8 border-l-2 border-[#FF7A33] pl-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#FF9A5C]">
                {eyebrow}
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                {title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">
                {description}
              </p>
              <p className="mt-4 text-xs text-white/35">
                Última actualización: 23 de octubre de 2026
              </p>
            </div>

            <div className="space-y-8 text-sm leading-7 text-white/70 [&_a]:text-[#FF9A5C] [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-white [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-2">
              {children}
            </div>
          </article>

          <aside className="h-fit rounded-2xl border border-white/10 bg-white/[0.035] p-5 md:sticky md:top-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
              Información legal
            </p>
            <nav aria-label="Políticas legales" className="mt-4 flex flex-col gap-1">
              {policies.map((policy) => (
                <Link
                  key={policy.href}
                  href={policy.href}
                  className="rounded-lg px-3 py-2 text-sm text-white/65 transition hover:bg-white/[0.06] hover:text-[#FF9A5C]"
                >
                  {policy.label}
                </Link>
              ))}
            </nav>
            <div className="mt-5 border-t border-white/10 pt-4 text-xs leading-6 text-white/45">
              <p>¿Tenés alguna consulta?</p>
              <a className="text-[#FF9A5C]" href="mailto:hola@simplelifemindset.com">
                hola@simplelifemindset.com
              </a>
              <p className="mt-2">Córdoba, Argentina</p>
            </div>
          </aside>
        </div>

        <footer className="flex flex-col gap-3 border-t border-white/10 pt-5 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Teilen Teens. Todos los derechos reservados.</span>
          <span>Información clara para una experiencia segura.</span>
        </footer>
      </div>
    </main>
  );
}
