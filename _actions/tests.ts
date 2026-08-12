"use server";

import { createClient } from "@/lib/supabase/server";

export type TestCard = {
  id: string;
  title: string;
  slug: string | null;
  description: string | null;
  isFree: boolean;
  itemCount: number;
};

export async function getPublishedTests(): Promise<{ success: true; data: { free: TestCard[]; paid: TestCard[] } } | { success: false; error: string }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tests")
    .select("id, title, slug, description, is_free, items")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) return { success: false, error: error.message };

  const cards: TestCard[] = data.map((t) => ({
    id: t.id,
    title: t.title,
    slug: t.slug,
    description: t.description,
    isFree: t.is_free,
    itemCount: Array.isArray(t.items) ? t.items.length : 0,
  }));

  return {
    success: true,
    data: {
      free: cards.filter((t) => t.isFree),
      paid: cards.filter((t) => !t.isFree),
    },
  };
}