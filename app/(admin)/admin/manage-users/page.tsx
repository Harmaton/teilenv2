// Suggested path: app/(admin)/admin/users/page.tsx
import { Users, UserPlus, Activity, MailCheck } from "lucide-react";

import { cn } from "@/lib/utils";
import { getUsersOverview, listUsers, listInvites } from "@/_actions/admin-users";
import { InviteForm } from "../../_components/invite-form";


const ACCENT = "#FF5A1F";

export default async function AdminUsersPage() {
  const [overviewResult, usersResult, invitesResult] = await Promise.all([
    getUsersOverview(),
    listUsers(),
    listInvites(),
  ]);

  if (!overviewResult.success) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-16 text-center">
        <p className="text-[13px] text-black/45">{overviewResult.error}</p>
      </div>
    );
  }

  const overview = overviewResult.data;
  const users = usersResult.success ? usersResult.data : [];
  const invites = invitesResult.success ? invitesResult.data : [];

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold text-black">Usuarios</h1>
        <p className="mt-1 text-[13px] text-black/45">Gestiona cuentas, roles e invitaciones.</p>
      </div>

      {/* ── Stats ─────────────────────────────────────────── */}
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard icon={Users} label="Usuarios totales" value={overview.totalUsers} />
        <StatCard icon={UserPlus} label="Nuevos esta semana" value={overview.newUsersThisWeek} />
        <StatCard icon={Activity} label="Activos (7 días)" value={overview.activeUsers7d} highlight />
        <StatCard icon={MailCheck} label="Invitaciones pendientes" value={overview.pendingInvites} />
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {Object.entries(overview.byRole).map(([role, count]) => (
          <span key={role} className="rounded-full border border-black/[0.08] px-3 py-1 text-[11.5px] text-black/60">
            {role}: {count}
          </span>
        ))}
      </div>

      {/* ── Invite form ───────────────────────────────────── */}
      <div className="mb-10">
        <InviteForm />
      </div>

      {/* ── Invites ───────────────────────────────────────── */}
      <div className="mb-10">
        <h2 className="mb-3 text-[15px] font-semibold text-black">Invitaciones</h2>
        {invites.length === 0 ? (
          <div className="rounded-2xl border border-black/[0.06] bg-black/[0.02] px-6 py-8 text-center">
            <p className="text-[13px] text-black/45">No hay invitaciones todavía.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-black/[0.06]">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="border-b border-black/[0.06] bg-black/[0.02] text-left">
                  <Th>Correo</Th>
                  <Th>Código</Th>
                  <Th>Rol</Th>
                  <Th>Estado</Th>
                  <Th align="right">Expira</Th>
                </tr>
              </thead>
              <tbody>
                {invites.map((i) => (
                  <tr key={i.id} className="border-b border-black/[0.04] last:border-0">
                    <Td className="font-medium text-black">{i.email}</Td>
                    <Td className="font-mono text-black/70">{i.code}</Td>
                    <Td className="text-black/60">{i.role}</Td>
                    <Td>
                      <span
                        className={cn(
                          "text-[12px]",
                          i.status === "pending" && "text-amber-600",
                          i.status === "accepted" && "text-emerald-700",
                          (i.status === "revoked" || i.status === "expired") && "text-black/35"
                        )}
                      >
                        {i.status}
                      </span>
                    </Td>
                    <Td align="right" className="text-black/45">
                      {formatDate(i.expiresAt)}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── All users ─────────────────────────────────────── */}
      <div>
        <h2 className="mb-3 text-[15px] font-semibold text-black">Todos los usuarios</h2>
        <div className="overflow-hidden rounded-2xl border border-black/[0.06]">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-black/[0.06] bg-black/[0.02] text-left">
                <Th>Nombre</Th>
                <Th>Correo</Th>
                <Th>Rol</Th>
                <Th>Estado</Th>
                <Th>Registrado</Th>
                <Th align="right">Última actividad</Th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-black/[0.04] last:border-0 hover:bg-black/[0.015]">
                  <Td className="font-medium text-black">{u.fullName ?? "—"}</Td>
                  <Td className="text-black/60">{u.email}</Td>
                  <Td className="text-black/60">{u.role}</Td>
                  <Td>
                    <span className={cn("text-[12px]", u.isActive ? "text-emerald-700" : "text-black/35")}>
                      {u.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </Td>
                  <Td className="text-black/45">{formatDate(u.createdAt)}</Td>
                  <Td align="right" className="text-black/45">
                    {u.lastAttemptAt ? formatDate(u.lastAttemptAt) : "—"}
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white px-4 py-4">
      <div
        className="mb-3 flex h-8 w-8 items-center justify-center rounded-full"
        style={{ backgroundColor: highlight ? ACCENT : "rgba(0,0,0,0.04)" }}
      >
        <Icon className={cn("h-4 w-4", highlight ? "text-white" : "text-black/50")} />
      </div>
      <div className="text-[20px] font-semibold text-black">{value}</div>
      <div className="mt-0.5 text-[12px] text-black/45">{label}</div>
    </div>
  );
}

function Th({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" }) {
  return (
    <th
      className={cn(
        "px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-black/35",
        align === "right" && "text-right"
      )}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  className,
  align = "left",
}: {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "right";
}) {
  return <td className={cn("px-4 py-3", align === "right" && "text-right", className)}>{children}</td>;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("es", { month: "short", day: "numeric" });
}