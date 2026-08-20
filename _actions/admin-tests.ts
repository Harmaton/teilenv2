"use server";

import { getAuthUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TestOption = {
  id: string;
  text: string;
};

export type TestQuestion = {
  id: string;
  question: string;
  options: TestOption[];
};

export type TestRow = {
  id: string;
  title: string;
  slug: string | null;
  description: string | null;
  is_free: boolean;
  is_published: boolean;
  items: TestQuestion[];
  created_by: string;
  created_at: string;
  updated_at: string;
};

// ─── Actions ──────────────────────────────────────────────────────────────────

export async function createTest(
  title: string,
  description: string = "",
  isFree: boolean = true
): Promise<{ success: true; testId: string } | { success: false; error: string }> {
  const authResult = await getAuthUser();
  if (!authResult.success) {
    return { success: false, error: authResult.error ?? "No se pudo autenticar." };
  }

  const supabase = await createClient();

  // Get profile ID (not auth ID)
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", authResult.user.id)
    .single();

  if (profileError || !profile) {
    return { success: false, error: "Perfil no encontrado." };
  }

  const slug = `test-${Date.now()}`;

  const { data, error } = await supabase
    .from("tests")
    .insert({
      title,
      slug,
      description: description || null,
      is_free: isFree,
      is_published: false,
      items: [],
      created_by: profile.id,
    })
    .select("id")
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, testId: data.id };
}

export async function getTestById(
  testId: string
): Promise<{ success: true; data: TestRow } | { success: false; error: string }> {
  const authResult = await getAuthUser();
  if (!authResult.success) {
    return { success: false, error: authResult.error };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tests")
    .select("*")
    .eq("id", testId)
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  if (!data) {
    return { success: false, error: "Test no encontrado." };
  }

  // Verify ownership
  if (data.created_by !== authResult.user.id) {
    // Check if user is admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", authResult.user.id)
      .single();

    if (!profile || (profile.role !== "admin" && profile.role !== "super_admin")) {
      return { success: false, error: "No tienes permiso para editar este test." };
    }
  }

  return {
    success: true,
    data: {
      id: data.id,
      title: data.title,
      slug: data.slug,
      description: data.description,
      is_free: data.is_free,
      is_published: data.is_published,
      items: Array.isArray(data.items) ? data.items : [],
      created_by: data.created_by,
      created_at: data.created_at,
      updated_at: data.updated_at,
    },
  };
}

export async function updateTestQuestions(
  testId: string,
  questions: TestQuestion[]
): Promise<{ success: true; message: string } | { success: false; error: string }> {
  const authResult = await getAuthUser();
  if (!authResult.success) {
    return { success: false, error: authResult.error ?? "No se pudo autenticar." };
  }

  // Validate question count
  if (questions.length > 60) {
    return { success: false, error: "Máximo 60 preguntas permitidas." };
  }

  // Validate each question has at least 2 options
  for (const q of questions) {
    if (q.options.length < 2) {
      return { success: false, error: `La pregunta "${q.question}" debe tener al menos 2 opciones.` };
    }
  }

  const supabase = await createClient();

  // Verify ownership
  const { data: test, error: testError } = await supabase
    .from("tests")
    .select("created_by")
    .eq("id", testId)
    .single();

  if (testError || !test) {
    return { success: false, error: "Test no encontrado." };
  }

  if (test.created_by !== authResult.user.id) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", authResult.user.id)
      .single();

    if (!profile || (profile.role !== "admin" && profile.role !== "super_admin")) {
      return { success: false, error: "No tienes permiso para editar este test." };
    }
  }

  const { error } = await supabase
    .from("tests")
    .update({
      items: questions,
      updated_at: new Date().toISOString(),
    })
    .eq("id", testId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, message: "Preguntas guardadas correctamente." };
}

export async function publishTest(testId: string): Promise<{ success: true; message: string } | { success: false; error: string }> {
  const authResult = await getAuthUser();
  if (!authResult.success) {
    return { success: false, error: authResult.error ?? "No se pudo autenticar." };
  }

  const supabase = await createClient();

  // Verify ownership and get test details
  const { data: test, error: testError } = await supabase
    .from("tests")
    .select("created_by, items")
    .eq("id", testId)
    .single();

  if (testError || !test) {
    return { success: false, error: "Test no encontrado." };
  }

  if (test.created_by !== authResult.user.id) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", authResult.user.id)
      .single();

    if (!profile || (profile.role !== "admin" && profile.role !== "super_admin")) {
      return { success: false, error: "No tienes permiso para publicar este test." };
    }
  }

  // Verify test has questions
  const items = Array.isArray(test.items) ? test.items : [];
  if (items.length === 0) {
    return { success: false, error: "El test debe tener al menos una pregunta." };
  }

  // Verify all questions have at least 2 options
  for (const q of items) {
    if (!Array.isArray(q.options) || q.options.length < 2) {
      return { success: false, error: "Todas las preguntas deben tener al menos 2 opciones." };
    }
  }

  const { error } = await supabase
    .from("tests")
    .update({
      is_published: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", testId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, message: "Test publicado correctamente." };
}

export async function updateTestTitle(testId: string, title: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("tests")
    .update({ title })
    .eq("id", testId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteTest(testId: string): Promise<{ success: true; message: string } | { success: false; error: string }> {
  const authResult = await getAuthUser();
  if (!authResult.success) {
    return { success: false, error: authResult.error ?? "No se pudo autenticar." };
  }

  const supabase = await createClient();

  // Verify ownership
  const { data: test, error: testError } = await supabase
    .from("tests")
    .select("created_by")
    .eq("id", testId)
    .single();

  if (testError || !test) {
    return { success: false, error: "Test no encontrado." };
  }

  if (test.created_by !== authResult.user.id) {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", authResult.user.id)
      .single();

    if (!profile || (profile.role !== "admin" && profile.role !== "super_admin")) {
      return { success: false, error: "No tienes permiso para eliminar este test." };
    }
  }

  const { error } = await supabase.from("tests").delete().eq("id", testId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, message: "Test eliminado correctamente." };
}

export async function getAdminTests(): Promise<
  { success: true; data: TestRow[] } | { success: false; error: string }
> {
  const authResult = await getAuthUser();
  if (!authResult.success) {
    return { success: false, error: authResult.error };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tests")
    .select("*")
    .eq("created_by", authResult.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return { success: false, error: error.message };
  }

  return {
    success: true,
    data: (data || []).map((test) => ({
      id: test.id,
      title: test.title,
      slug: test.slug,
      description: test.description,
      is_free: test.is_free,
      is_published: test.is_published,
      items: Array.isArray(test.items) ? test.items : [],
      created_by: test.created_by,
      created_at: test.created_at,
      updated_at: test.updated_at,
    })),
  };
}
