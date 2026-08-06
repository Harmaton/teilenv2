'use server';

import { createClient } from "@/lib/supabase/server";

export type NotificationType = 'info' | 'warning' | 'success' | 'error';

export interface AppNotification {
  id:         string;
  profile_id: string;
  title:      string;
  body:       string | null;
  type:       NotificationType;
  read:       boolean;
  href:       string | null;
  created_at: string;
}

async function getProfileId() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error('Unauthenticated');
  const { data: profile } = await supabase
    .from('profiles').select('id').eq('id', user.id).single();
  if (!profile) throw new Error('Profile not found');
  return profile.id as string;
}

export async function getNotifications(): Promise<AppNotification[]> {
  const supabase  = await createClient();
  const profileId = await getProfileId();
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('profile_id', profileId)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return (data ?? []) as AppNotification[];
}

export async function getUnreadCount(): Promise<number> {
  const supabase  = await createClient();
  const profileId = await getProfileId();
  const { count, error } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('profile_id', profileId)
    .eq('read', false);
  if (error) throw error;
  return count ?? 0;
}

export async function markNotificationRead(id: string): Promise<void> {
  const supabase  = await createClient();
  const profileId = await getProfileId();
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', id)
    .eq('profile_id', profileId);
  if (error) throw error;
}

export async function markAllNotificationsRead(): Promise<void> {
  const supabase  = await createClient();
  const profileId = await getProfileId();
  
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('profile_id', profileId)
    .eq('read', false);
  if (error) throw error;
}

export async function pushNotification(input: {
  profile_id: string;
  title:      string;
  body?:      string;
  type?:      NotificationType;
  href?:      string;
}): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('notifications').insert({
    profile_id: input.profile_id,
    title:      input.title,
    body:       input.body ?? null,
    type:       input.type ?? 'info',
    href:       input.href ?? null,
  });
  if (error) throw error;
}

export async function pushNotificationToAll(input: {
  title: string;
  body?: string;
  type?: NotificationType;
  href?: string;
}): Promise<void> {
  const supabase = await createClient();
  const { data: profiles, error: pErr } = await supabase
    .from('profiles').select('id');
  if (pErr) throw pErr;
  if (!profiles?.length) return;
  const rows = profiles.map((p) => ({
    profile_id: p.id,
    title:      input.title,
    body:       input.body ?? null,
    type:       input.type ?? 'info',
    href:       input.href ?? null,
  }));
  const { error } = await supabase.from('notifications').insert(rows);
  if (error) throw error;
}