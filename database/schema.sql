-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.profiles (
  id uuid NOT NULL,
  email text,
  full_name text,
  avatar_url text,
  role text NOT NULL DEFAULT 'viewer'::text CHECK (role = ANY (ARRAY['super_admin'::text, 'admin'::text, 'editor'::text, 'author'::text, 'viewer'::text])),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  values ARRAY DEFAULT ARRAY[]::text[],
  strengths ARRAY DEFAULT ARRAY[]::text[],
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.roles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  permissions jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_system boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT roles_pkey PRIMARY KEY (id)
);
CREATE TABLE public.user_roles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL,
  role_id uuid NOT NULL,
  assigned_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT user_roles_pkey PRIMARY KEY (id),
  CONSTRAINT user_roles_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id),
  CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id),
  CONSTRAINT user_roles_assigned_by_fkey FOREIGN KEY (assigned_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.tests (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE,
  description text,
  is_free boolean NOT NULL DEFAULT true,
  is_published boolean NOT NULL DEFAULT false,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT tests_pkey PRIMARY KEY (id),
  CONSTRAINT tests_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.test_attempts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  test_id uuid NOT NULL,
  profile_id uuid NOT NULL,
  items_snapshot jsonb NOT NULL DEFAULT '[]'::jsonb,
  answers jsonb NOT NULL DEFAULT '[]'::jsonb,
  score numeric,
  status text NOT NULL DEFAULT 'not_started'::text CHECK (status = ANY (ARRAY['not_started'::text, 'in_progress'::text, 'completed'::text, 'abandoned'::text])),
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  quadrant_scores jsonb NOT NULL DEFAULT '{}'::jsonb,
  CONSTRAINT test_attempts_pkey PRIMARY KEY (id),
  CONSTRAINT test_attempts_test_id_fkey FOREIGN KEY (test_id) REFERENCES public.tests(id),
  CONSTRAINT test_attempts_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.reports (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  test_id uuid NOT NULL,
  attempt_id uuid,
  profile_id uuid NOT NULL,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  ai_model text,
  status text NOT NULL DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'generating'::text, 'completed'::text, 'failed'::text])),
  error text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  access_type text NOT NULL DEFAULT 'paid'::text CHECK (access_type = ANY (ARRAY['paid'::text, 'free_code'::text, 'admin_granted'::text])),
  access_code_id uuid,
  granted_by uuid,
  CONSTRAINT reports_pkey PRIMARY KEY (id),
  CONSTRAINT reports_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id),
  CONSTRAINT reports_test_id_fkey FOREIGN KEY (test_id) REFERENCES public.tests(id),
  CONSTRAINT reports_attempt_id_fkey FOREIGN KEY (attempt_id) REFERENCES public.test_attempts(id),
  CONSTRAINT reports_access_code_id_fkey FOREIGN KEY (access_code_id) REFERENCES public.access_codes(id),
  CONSTRAINT reports_granted_by_fkey FOREIGN KEY (granted_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.ai_credits_usage (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL,
  report_id uuid,
  credits_used numeric NOT NULL DEFAULT 0,
  model text,
  input_tokens integer,
  output_tokens integer,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT ai_credits_usage_pkey PRIMARY KEY (id),
  CONSTRAINT ai_credits_usage_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id),
  CONSTRAINT ai_credits_usage_report_id_fkey FOREIGN KEY (report_id) REFERENCES public.reports(id)
);
CREATE TABLE public.user_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL,
  key text NOT NULL,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  category text NOT NULL DEFAULT 'general'::text,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT user_settings_pkey PRIMARY KEY (id),
  CONSTRAINT user_settings_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL,
  title text NOT NULL,
  body text,
  type text NOT NULL CHECK (type = ANY (ARRAY['info'::text, 'success'::text, 'warning'::text, 'error'::text])),
  read boolean NOT NULL DEFAULT false,
  href text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.invites (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email text NOT NULL,
  code text NOT NULL UNIQUE,
  role text NOT NULL DEFAULT 'viewer'::text CHECK (role = ANY (ARRAY['admin'::text, 'editor'::text, 'author'::text, 'viewer'::text])),
  invited_by uuid,
  status text NOT NULL DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'accepted'::text, 'expired'::text, 'revoked'::text])),
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + '7 days'::interval),
  accepted_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT invites_pkey PRIMARY KEY (id),
  CONSTRAINT invites_invited_by_fkey FOREIGN KEY (invited_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.profile_details (
  profile_id uuid NOT NULL,
  age integer CHECK (age >= 15 AND age <= 99),
  sex text CHECK (sex = ANY (ARRAY['masculino'::text, 'femenino'::text, 'no binario'::text, 'prefiero no decir'::text])),
  country text,
  city text,
  phone text,
  date_of_birth date,
  education_level text CHECK (education_level = ANY (ARRAY['secundario'::text, 'terciario'::text, 'universitario'::text, 'otro'::text])),
  interests ARRAY DEFAULT '{}'::text[],
  occupation text,
  preferred_language text DEFAULT 'es'::text,
  profile_completed boolean DEFAULT false,
  last_active timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT profile_details_pkey PRIMARY KEY (profile_id),
  CONSTRAINT profile_details_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.access_codes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  description text,
  code_type text NOT NULL DEFAULT 'general'::text CHECK (code_type = ANY (ARRAY['general'::text, 'user_specific'::text])),
  assigned_profile_id uuid,
  max_uses integer,
  current_uses integer NOT NULL DEFAULT 0,
  expires_at timestamp with time zone,
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT access_codes_pkey PRIMARY KEY (id),
  CONSTRAINT access_codes_assigned_profile_id_fkey FOREIGN KEY (assigned_profile_id) REFERENCES public.profiles(id),
  CONSTRAINT access_codes_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.access_code_redemptions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  access_code_id uuid NOT NULL,
  profile_id uuid NOT NULL,
  report_id uuid,
  test_id uuid,
  code_snapshot text NOT NULL,
  redeemed_at timestamp with time zone NOT NULL DEFAULT now(),
  ip_address text,
  user_agent text,
  CONSTRAINT access_code_redemptions_pkey PRIMARY KEY (id),
  CONSTRAINT access_code_redemptions_report_id_fkey FOREIGN KEY (report_id) REFERENCES public.reports(id),
  CONSTRAINT access_code_redemptions_test_id_fkey FOREIGN KEY (test_id) REFERENCES public.tests(id),
  CONSTRAINT access_code_redemptions_access_code_id_fkey FOREIGN KEY (access_code_id) REFERENCES public.access_codes(id),
  CONSTRAINT access_code_redemptions_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id)
);