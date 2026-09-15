"use client";

import { useEffect, useState, useTransition } from "react";
import {
  createAccessCode,
  deleteAccessCode,
  listAccessCodes,
  listCodeRedemptions,
  searchProfiles,
  toggleAccessCode,
  AccessCodeRow,
  RedemptionRow,
} from "@/_actions/code-access";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Plus,
  Trash2,
  Power,
  Copy,
  Check,
  Ticket,
  Users,
  History,
  CheckCircle2,
  AlertCircle,
  Search,
} from "lucide-react";

type UserResult = {
  id: string;
  full_name: string | null;
  email: string | null;
};

export default function AccessCodesClient() {
  const [codes, setCodes] = useState<AccessCodeRow[]>([]);
  const [redemptions, setRedemptions] = useState<RedemptionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Form state
  const [codeType, setCodeType] = useState<"general" | "user_specific">("general");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [maxUses, setMaxUses] = useState<string>("");
  const [expiresAt, setExpiresAt] = useState<string>("");
  const [userQuery, setUserQuery] = useState("");

 const [userResults, setUserResults] = useState<UserResult[]>([]);

  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const [formMessage, setFormMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Copy state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    const [codesRes, redemptionsRes] = await Promise.all([
      listAccessCodes(),
      listCodeRedemptions(),
    ]);
    if (codesRes.success) setCodes(codesRes.data ?? []);
    if (redemptionsRes.success) setRedemptions(redemptionsRes.data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  // Debounced user search
  useEffect(() => {
    if (codeType !== "user_specific") return;
    if (userQuery.trim().length < 2) {
      setUserResults([]);
      return;
    }
    const t = setTimeout(async () => {
      const res = await searchProfiles(userQuery);
      if (res.success) setUserResults(res.data ?? []);
    }, 300);
    return () => clearTimeout(t);
  }, [userQuery, codeType]);

  function handleCreate() {
    setFormMessage(null);
    startTransition(async () => {
      const res = await createAccessCode({
        code,
        description: description || undefined,
        codeType,
        assignedProfileId: selectedUser?.id ?? null,
        maxUses: maxUses ? parseInt(maxUses, 10) : null,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
      });

      if (res.success) {
        setFormMessage({ type: "success", text: res.message ?? "Creado" });
        setCode("");
        setDescription("");
        setMaxUses("");
        setExpiresAt("");
        setSelectedUser(null);
        setUserQuery("");
        setUserResults([]);
        await refresh();
      } else {
        setFormMessage({ type: "error", text: res.error });
      }
    });
  }

  function handleToggle(row: AccessCodeRow) {
    startTransition(async () => {
      const res = await toggleAccessCode(row.id, !row.is_active);
      if (res.success) await refresh();
    });
  }

  function handleDelete(row: AccessCodeRow) {
    if (!confirm(`¿Eliminar el código "${row.code}"? Esta acción no se puede deshacer.`))
      return;
    startTransition(async () => {
      const res = await deleteAccessCode(row.id);
      if (res.success) await refresh();
    });
  }

  function handleCopy(id: string, value: string) {
    navigator.clipboard.writeText(value);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  return (
    <div className="container mx-auto max-w-6xl p-6">
      {/* Page header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-600">
          <Ticket className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Códigos de Acceso Gratuito
          </h1>
          <p className="text-sm text-gray-500">
            Crea, administra y monitorea los códigos de acceso a informes.
          </p>
        </div>
      </div>

      <Tabs defaultValue="codes" className="w-full">
        <TabsList className="mb-6 bg-gray-100/80 p-1">
          <TabsTrigger value="codes" className="gap-1.5">
            <Ticket className="h-3.5 w-3.5" />
            Códigos
          </TabsTrigger>
          <TabsTrigger value="redemptions" className="gap-1.5">
            <History className="h-3.5 w-3.5" />
            Canjes
            <span className="ml-0.5 rounded-full bg-gray-200 px-1.5 py-0.5 text-[10px] font-semibold text-gray-600">
              {redemptions.length}
            </span>
          </TabsTrigger>
        </TabsList>

        {/* ============ CODES TAB ============ */}
        <TabsContent value="codes" className="space-y-8">
          {/* CREATE FORM */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <Plus className="h-4 w-4 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Crear nuevo código
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <Label className="mb-1.5 block text-xs font-medium text-gray-600">
                  Tipo de código
                </Label>
                <Select
                  value={codeType}
                  onValueChange={(v: "general" | "user_specific" | null) => {
                    if (v) setCodeType(v);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">
                      General (cualquiera puede usarlo)
                    </SelectItem>
                    <SelectItem value="user_specific">
                      Específico (un usuario)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-1.5 block text-xs font-medium text-gray-600">
                  Código
                </Label>
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="EJ: WELCOME2025"
                  className="font-mono uppercase tracking-wide"
                />
              </div>

              <div className="md:col-span-2">
                <Label className="mb-1.5 block text-xs font-medium text-gray-600">
                  Descripción <span className="font-normal text-gray-400">(opcional)</span>
                </Label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Campaña de lanzamiento..."
                />
              </div>

              <div>
                <Label className="mb-1.5 block text-xs font-medium text-gray-600">
                  Máximo de usos <span className="font-normal text-gray-400">(vacío = ilimitado)</span>
                </Label>
                <Input
                  type="number"
                  min={1}
                  value={maxUses}
                  onChange={(e) => setMaxUses(e.target.value)}
                  placeholder="Ilimitado"
                />
              </div>

              <div>
                <Label className="mb-1.5 block text-xs font-medium text-gray-600">
                  Expira <span className="font-normal text-gray-400">(vacío = nunca)</span>
                </Label>
                <Input
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                />
              </div>

              {codeType === "user_specific" && (
                <div className="md:col-span-2">
                  <Label className="mb-1.5 block text-xs font-medium text-gray-600">
                    Buscar usuario
                  </Label>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                    <Input
                      value={userQuery}
                      onChange={(e) => setUserQuery(e.target.value)}
                      placeholder="Buscar por email o nombre..."
                      className="pl-8"
                    />
                  </div>
                  {selectedUser ? (
                    <div className="mt-2 flex items-center justify-between rounded-lg border border-indigo-200 bg-indigo-50 p-3">
                      <span className="text-sm text-indigo-900">
                        Asignado a: <strong>{selectedUser.label}</strong>
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedUser(null)}
                      >
                        Cambiar
                      </Button>
                    </div>
                  ) : (
                    userResults.length > 0 && (
                      <div className="mt-2 max-h-60 divide-y overflow-auto rounded-lg border shadow-sm">
                        {userResults.map((u) => (
                          <button
                            key={u.id}
                            type="button"
                            onClick={() => {
                              setSelectedUser({
                                id: u.id,
                                label: `${u.full_name ?? "Sin nombre"} (${u.email ?? "sin email"})`,
                              });
                              setUserResults([]);
                              setUserQuery("");
                            }}
                            className="flex w-full items-center gap-2.5 p-2.5 text-left text-sm transition-colors hover:bg-indigo-50"
                          >
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-500">
                              {(u.full_name ?? "?").charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{u.full_name}</div>
                              <div className="text-gray-500">{u.email}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            {formMessage && (
              <div
                className={`mt-4 flex items-center gap-2 rounded-lg p-3 text-sm ${
                  formMessage.type === "success"
                    ? "border border-green-200 bg-green-50 text-green-800"
                    : "border border-red-200 bg-red-50 text-red-800"
                }`}
              >
                {formMessage.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 shrink-0" />
                )}
                {formMessage.text}
              </div>
            )}

            <Button
              className="mt-5"
              onClick={handleCreate}
              disabled={isPending || !code}
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Crear código
            </Button>
          </div>

          {/* LIST */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b p-4">
              <Ticket className="h-4 w-4 text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900">
                Códigos existentes
              </h2>
            </div>
            {loading ? (
              <div className="p-12 text-center text-gray-400">
                <Loader2 className="mx-auto h-6 w-6 animate-spin" />
              </div>
            ) : codes.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <Ticket className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                No hay códigos todavía.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="p-3 text-left font-medium">Código</th>
                      <th className="p-3 text-left font-medium">Tipo</th>
                      <th className="p-3 text-left font-medium">Asignado</th>
                      <th className="p-3 text-left font-medium">Usos</th>
                      <th className="p-3 text-left font-medium">Expira</th>
                      <th className="p-3 text-left font-medium">Estado</th>
                      <th className="p-3 text-right font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {codes.map((c) => (
                      <tr key={c.id} className="transition-colors hover:bg-gray-50/80">
                        <td className="p-3 font-mono font-semibold">
                          <button
                            onClick={() => handleCopy(c.id, c.code)}
                            className="flex items-center gap-2 rounded transition-colors hover:text-indigo-600"
                          >
                            {c.code}
                            {copiedId === c.id ? (
                              <Check className="h-3 w-3 text-green-600" />
                            ) : (
                              <Copy className="h-3 w-3 text-gray-400" />
                            )}
                          </button>
                          {c.description && (
                            <div className="mt-1 text-xs font-normal text-gray-500">
                              {c.description}
                            </div>
                          )}
                        </td>
                        <td className="p-3">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                              c.code_type === "general"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-purple-50 text-purple-700"
                            }`}
                          >
                            {c.code_type === "general" ? "General" : "Usuario"}
                          </span>
                        </td>
                        <td className="p-3">
                          {c.assigned_profile_name || c.assigned_profile_email ? (
                            <div>
                              <div className="font-medium text-gray-900">
                                {c.assigned_profile_name ?? "—"}
                              </div>
                              <div className="text-xs text-gray-500">
                                {c.assigned_profile_email}
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                        <td className="p-3 tabular-nums text-gray-700">
                          {c.current_uses}
                          {c.max_uses != null && (
                            <span className="text-gray-400"> / {c.max_uses}</span>
                          )}
                        </td>
                        <td className="p-3 text-xs text-gray-500">
                          {c.expires_at
                            ? new Date(c.expires_at).toLocaleDateString()
                            : "—"}
                        </td>
                        <td className="p-3">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                              c.is_active
                                ? "bg-green-50 text-green-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                c.is_active ? "bg-green-500" : "bg-red-500"
                              }`}
                            />
                            {c.is_active ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggle(c)}
                            disabled={isPending}
                            title={c.is_active ? "Desactivar" : "Activar"}
                          >
                            <Power className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(c)}
                            disabled={isPending}
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>

        {/* ============ REDEMPTIONS TAB ============ */}
        <TabsContent value="redemptions">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b p-4">
              <Users className="h-4 w-4 text-gray-400" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Usuarios que canjearon códigos
                </h2>
                <p className="text-xs text-gray-500">
                  Registro completo de accesos gratuitos.
                </p>
              </div>
            </div>
            {redemptions.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <History className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                Aún no hay canjes.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="p-3 text-left font-medium">Usuario</th>
                      <th className="p-3 text-left font-medium">Email</th>
                      <th className="p-3 text-left font-medium">Código</th>
                      <th className="p-3 text-left font-medium">Informe</th>
                      <th className="p-3 text-left font-medium">Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {redemptions.map((r) => (
                      <tr key={r.id} className="transition-colors hover:bg-gray-50/80">
                        <td className="p-3 font-medium text-gray-900">
                          {r.profile_name ?? (
                            <span className="font-normal text-gray-300">Sin nombre</span>
                          )}
                        </td>
                        <td className="p-3 text-gray-600">{r.profile_email ?? "—"}</td>
                        <td className="p-3 font-mono text-xs text-gray-700">{r.code_snapshot}</td>
                        <td className="p-3">
                          {r.report_id ? (
                            <a
                              href={`/reports/${r.report_id}`}
                              className="text-indigo-600 hover:underline"
                            >
                              Ver informe
                            </a>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                        <td className="p-3 text-xs text-gray-500">
                          {new Date(r.redeemed_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}