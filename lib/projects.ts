import { createClient } from "@/lib/supabase/server"

export type ProjectStatus = "planning" | "in_progress" | "completed" | "archived"

export type Project = {
  id:          string
  title:       string
  description: string | null
  status:      ProjectStatus
  due_at:      string | null
  created_by:  string | null
  created_at:  string
  updated_at:  string
}

export type CreateProjectInput = {
  title:       string
  description?: string
  status?:     ProjectStatus
  due_at?:     string | null
  created_by?: string | null
}

export type UpdateProjectInput = Partial<CreateProjectInput>

export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw new Error(`Failed to fetch projects: ${error.message}`)
  return data ?? []
}

export async function createProject(input: CreateProjectInput): Promise<Project> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("projects")
    .insert({ ...input, status: input.status ?? "planning" })
    .select()
    .single()

  if (error) throw new Error(`Failed to create project: ${error.message}`)
  return data
}

export async function updateProject(
  id: string,
  input: UpdateProjectInput
): Promise<Project> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("projects")
    .update(input)
    .eq("id", id)
    .select()
    .single()

  if (error) throw new Error(`Failed to update project: ${error.message}`)
  return data
}

export async function deleteProject(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id)

  if (error) throw new Error(`Failed to delete project: ${error.message}`)
}