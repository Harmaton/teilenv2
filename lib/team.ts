import { createClient } from "@/lib/supabase/server"

export type SocialLinks = {
  twitter?:  string
  linkedin?: string
  github?:   string
  website?:  string
  instagram?: string
}

export type TeamMember = {
  id:            string
  name:          string
  nickname:      string | null
  role:          string
  department:    string | null
  image_url:     string | null
  description:   string | null
  bio:           string | null
  social_links:  SocialLinks
  is_active:     boolean
  display_order: number
  created_at:    string
  updated_at:    string
}

export type CreateTeamMemberInput = {
  name:          string
  nickname?:     string
  role:          string
  department?:   string
  image_url?:    string
  description?:  string
  bio?:          string
  social_links?: SocialLinks
  is_active?:    boolean
  display_order?: number
}

export type UpdateTeamMemberInput = Partial<CreateTeamMemberInput>

export async function getTeamMembers(): Promise<TeamMember[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at",    { ascending: false })

  if (error) throw new Error(`Failed to fetch team members: ${error.message}`)
  return data ?? []
}

export async function createTeamMember(input: CreateTeamMemberInput): Promise<TeamMember> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("team_members")
    .insert({
      ...input,
      social_links: input.social_links ?? {},
      is_active:    input.is_active    ?? true,
    })
    .select()
    .single()

  if (error) throw new Error(`Failed to create team member: ${error.message}`)
  return data
}

export async function updateTeamMember(id: string, input: UpdateTeamMemberInput): Promise<TeamMember> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("team_members")
    .update(input)
    .eq("id", id)
    .select()
    .single()

  if (error) throw new Error(`Failed to update team member: ${error.message}`)
  return data
}

export async function deleteTeamMember(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from("team_members")
    .delete()
    .eq("id", id)

  if (error) throw new Error(`Failed to delete team member: ${error.message}`)
}