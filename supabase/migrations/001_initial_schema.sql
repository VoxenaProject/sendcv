-- QuickApply - Schema initial

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL DEFAULT '',
  credits INTEGER NOT NULL DEFAULT 0,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'lifetime')),
  free_generation_used BOOLEAN NOT NULL DEFAULT FALSE,
  generation_count INTEGER NOT NULL DEFAULT 0,
  -- Profil candidat (rempli au premier usage)
  headline TEXT,
  experience TEXT,
  education TEXT,
  skills TEXT,
  languages TEXT,
  location TEXT,
  linkedin_url TEXT,
  -- Subscription
  stripe_customer_id TEXT,
  subscription_id TEXT,
  subscription_status TEXT,
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  -- Input
  job_url TEXT,
  job_title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  job_description TEXT NOT NULL,
  -- Analysis (free preview)
  analysis JSONB,
  match_score INTEGER,
  -- Generated content (paid)
  generated_cv TEXT,
  structured_cv JSONB,
  generated_cover_letter TEXT,
  generated_interview_prep JSONB,
  generated_linkedin_tips TEXT,
  -- Status
  status TEXT NOT NULL DEFAULT 'analyzed' CHECK (status IN ('analyzed', 'generated', 'applied', 'interview', 'rejected', 'hired')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- positif = achat, negatif = usage
  type TEXT NOT NULL CHECK (type IN ('purchase', 'usage', 'refund', 'bonus')),
  description TEXT,
  stripe_session_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_applications_user ON public.applications(user_id, created_at DESC);
CREATE INDEX idx_credits_user ON public.credit_transactions(user_id, created_at DESC);

-- Auto-update
CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own profile" ON public.profiles FOR ALL USING (auth.uid() = id);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own applications" ON public.applications FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own transactions" ON public.credit_transactions FOR ALL USING (auth.uid() = user_id);
