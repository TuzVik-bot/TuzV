
-- Roles infra
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

CREATE POLICY "Admins view roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Registrations table
CREATE TABLE public.registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company TEXT,
  status TEXT NOT NULL CHECK (status IN ('yes','no')),
  attendee_count INT NOT NULL DEFAULT 1 CHECK (attendee_count BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Anyone (including anon) can submit
CREATE POLICY "Anyone can submit registration"
ON public.registrations FOR INSERT TO anon, authenticated
WITH CHECK (char_length(name) BETWEEN 1 AND 200);

-- Only admins can read
CREATE POLICY "Admins can view registrations"
ON public.registrations FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
