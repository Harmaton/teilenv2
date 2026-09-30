import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type UserExportRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
};

/**
 * Streams an .xlsx of every profile. Kept in a Node runtime route because
 * exceljs needs Node APIs; it is the only place the workbook is built, so the
 * browser never holds the full buffer.
 */
export async function GET() {
  const authResult = await getAuthUser();
  if (!authResult.success) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  const supabase = await createClient();
  const { data: me, error: meError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authResult.user.id)
    .single();

  if (meError) return NextResponse.json({ error: meError.message }, { status: 403 });
  if (!me || !["admin", "super_admin"].includes(me.role)) {
    return NextResponse.json({ error: "No tienes permisos para exportar usuarios." }, { status: 403 });
  }

  const [profilesRes, attemptsRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, email, role, is_active, created_at")
      .order("created_at", { ascending: false }),
    supabase.from("test_attempts").select("profile_id, created_at, status"),
  ]);

  if (profilesRes.error) {
    return NextResponse.json({ error: profilesRes.error.message }, { status: 500 });
  }

  const profiles = (profilesRes.data ?? []) as UserExportRow[];

  // Aggregate per-user stats so the sheet is actually useful, not just a dump.
  type Stats = {
    attempts: number;
    completed: number;
    reports: number;
    lastActivity: string | null;
  };
  const stats = new Map<string, Stats>();
  const blank: Stats = { attempts: 0, completed: 0, reports: 0, lastActivity: null };

  for (const a of attemptsRes.data ?? []) {
    const s = stats.get(a.profile_id) ?? { ...blank };
    s.attempts += 1;
    if (a.status === "completed") s.completed += 1;
    if (!s.lastActivity || a.created_at > s.lastActivity) s.lastActivity = a.created_at;
    stats.set(a.profile_id, s);
  }

  const { data: reports } = await supabase.from("reports").select("profile_id, status");
  for (const r of reports ?? []) {
    const s = stats.get(r.profile_id) ?? { ...blank };
    s.reports += 1;
    stats.set(r.profile_id, s);
  }

  const ExcelJS = (await import("exceljs")).default;
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Teilen Teens";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Usuarios");

  sheet.columns = [
    { header: "Nombre", key: "name", width: 28 },
    { header: "Correo", key: "email", width: 34 },
    { header: "Rol", key: "role", width: 12 },
    { header: "Estado", key: "status", width: 12 },
    { header: "Tests", key: "attempts", width: 9 },
    { header: "Completados", key: "completed", width: 13 },
    { header: "Informes", key: "reports", width: 10 },
    { header: "Registrado", key: "createdAt", width: 14 },
    { header: "Última actividad", key: "lastActivity", width: 18 },
  ];

  const header = sheet.getRow(1);
  header.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
  header.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF217346" } }; // Excel green
  header.alignment = { vertical: "middle" };
  header.height = 22;

  const formatDate = (value: string | null) => {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    // Written as a plain string so Excel does not re-interpret the locale.
    return d.toISOString().slice(0, 19).replace("T", " ");
  };

  for (const p of profiles) {
    const s = stats.get(p.id);
    sheet.addRow({
      name: p.full_name ?? "",
      email: p.email ?? "",
      role: p.role ?? "",
      status: p.is_active ? "Activo" : "Inactivo",
      attempts: s?.attempts ?? 0,
      completed: s?.completed ?? 0,
      reports: s?.reports ?? 0,
      createdAt: formatDate(p.created_at),
      lastActivity: formatDate(s?.lastActivity ?? null),
    });
  }

  // Zebra striping so wide sheets stay readable.
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    if (rowNumber % 2 === 0) {
      row.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF2F7F4" } };
    }
  });

  sheet.views = [{ state: "frozen", ySplit: 1 }];
  sheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: 9 } };

  const buffer = await workbook.xlsx.writeBuffer();

  const stamp = new Date().toISOString().slice(0, 10);

  return new NextResponse(buffer as ArrayBuffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="usuarios-teilen-${stamp}.xlsx"`,
      "Cache-Control": "no-store",
    },
  });
}
