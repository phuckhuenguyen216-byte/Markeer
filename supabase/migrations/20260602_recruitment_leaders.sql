-- Shared recruitment leaders used by the admin applications module.

CREATE TABLE IF NOT EXISTS public.recruitment_leaders (
  id          TEXT        PRIMARY KEY DEFAULT ('leader-' || replace(gen_random_uuid()::text, '-', '')),
  name        TEXT        NOT NULL CHECK (length(trim(name)) > 0),
  team        TEXT        NOT NULL CHECK (team IN ('Marketing', 'Dev/DevOps', 'AI', 'Infrastructure', 'Sales', 'Other')),
  is_active   BOOLEAN     DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_recruitment_leaders_active
  ON public.recruitment_leaders(is_active, created_at);

CREATE OR REPLACE FUNCTION public.update_recruitment_leaders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS recruitment_leaders_updated_at ON public.recruitment_leaders;
CREATE TRIGGER recruitment_leaders_updated_at
  BEFORE UPDATE ON public.recruitment_leaders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_recruitment_leaders_updated_at();

ALTER TABLE public.recruitment_leaders ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'recruitment_leaders'
      AND policyname = 'Service role full access recruitment leaders'
  ) THEN
    CREATE POLICY "Service role full access recruitment leaders"
      ON public.recruitment_leaders FOR ALL
      USING (true)
      WITH CHECK (true);
  END IF;
END;
$$;

INSERT INTO public.recruitment_leaders (id, name, team)
VALUES
  ('leader-mkt', 'Thuong', 'Marketing'),
  ('leader-dev', 'Dev Lead', 'Dev/DevOps'),
  ('leader-ai', 'AI Lead', 'AI')
ON CONFLICT (id) DO UPDATE
SET
  name = EXCLUDED.name,
  team = EXCLUDED.team,
  is_active = true;
