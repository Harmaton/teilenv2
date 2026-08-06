
export type DashboardStats = {
  activeTeamMembers: number
  totalProjects:     number
  totalBlogs:        number
  liveProgrammes:    number
}

// ─── Enrolment trend ──────────────────────────────────────────────────────────

export type EnrolmentPoint = {
  week:  string
  count: number
}

// ─── Quick actions ────────────────────────────────────────────────────────────

export type QuickAction = {
  id:    string
  label: string
  sub:   string
  href:  string
  icon:  "invite" | "blog" | "cohort"
}

// ─── Deadlines ────────────────────────────────────────────────────────────────

export type DeadlineUrgency = "critical" | "soon" | "upcoming"

export type Deadline = {
  id:        string
  title:     string
  meta:      string
  due_at:    string | null
  days_left: number | null
  urgency:   DeadlineUrgency
}

// ─── Activity feed ────────────────────────────────────────────────────────────

export type ActivityEvent = {
  id:          string
  text:        string
  time:        string
  occurred_at: string
}

// ─── Recent members ───────────────────────────────────────────────────────────

export type MemberStatus = "active" | "inactive" | "pending"

export type RecentMember = {
  id:        string
  full_name: string | null
  email:     string
  role:      string
  joined_at: string
  status:    MemberStatus
}

// ─── Live programmes ──────────────────────────────────────────────────────────

export type ProgrammeStatus =
  | "draft"
  | "enrolment_open"
  | "active"
  | "cohort_full"
  | "running"
  | "completed"
  | "archived"

export type ProgrammeSector =
  | "general"
  | "executive"
  | "enterprise"
  | "government"
  | "informal_sector"
  | "academic"

export type ProgrammeFormat =
  | "online"
  | "onsite"
  | "hybrid"
  | "residential"
  | "embedded"
  | "mobile_first"
  | "mou_based"
  | "in_country"

export type LiveProgramme = {
  id:       string
  title:    string
  slug:     string
  tagline:  string | null
  type:     "cohort" | "programme"
  status:   ProgrammeStatus
  format:   ProgrammeFormat
  enrolled: number
  ends_at:  string | null
}

// ─── Recent blogs ─────────────────────────────────────────────────────────────

export type ArticleStatus = "draft" | "review" | "published" | "archived"

export type RecentBlog = {
  id:           string
  title:        string
  slug:         string
  author_name:  string | null
  published_at: string | null
  status:       ArticleStatus
  time_to_read: number | null
  views:        number
}

// ─── Breakdowns ───────────────────────────────────────────────────────────────

export type ContentBreakdown = {
  published: number
  review:    number
  draft:     number
  archived:  number
}

export type ProjectBreakdown = {
  completed:   number
  in_progress: number
  planning:    number
}

export type ProgrammeBreakdown = {
  draft:          number
  enrolment_open: number
  active:         number
  cohort_full:    number
  running:        number
  completed:      number
  archived:       number
}

export type DashboardData = {
  stats:              DashboardStats
  enrolmentTrend:     EnrolmentPoint[]
  quickActions:       QuickAction[]
  deadlines:          Deadline[]
  activityFeed:       ActivityEvent[]
  recentMembers:      RecentMember[]
  liveProgrammes:     LiveProgramme[]
  recentBlogs:        RecentBlog[]
  contentBreakdown:   ContentBreakdown
  projectBreakdown:   ProjectBreakdown   
  programmeBreakdown: ProgrammeBreakdown
}