import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import AccessCodesClient from "../../_components/AccessCodesClient";


export default async function AccessCodesPage() {
  const authResult = await getAuthUser();
  if (!authResult.success) redirect("/login");

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authResult.user.id)
    .single();

  if (!profile || !["super_admin", "admin"].includes(profile.role)) {
    redirect("/");
  }

  return <AccessCodesClient />;
}