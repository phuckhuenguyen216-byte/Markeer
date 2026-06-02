-- Manage which recruitment positions are currently visible on the public form.

CREATE TABLE IF NOT EXISTS public.recruitment_positions (
  id          TEXT        PRIMARY KEY,
  label       TEXT        NOT NULL UNIQUE CHECK (length(trim(label)) > 0),
  team        TEXT        NOT NULL CHECK (team IN ('Infrastructure', 'Dev/DevOps', 'AI', 'Marketing', 'Sales')),
  sort_order  INTEGER     NOT NULL DEFAULT 0,
  is_active   BOOLEAN     NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_recruitment_positions_active
  ON public.recruitment_positions(is_active, sort_order);

CREATE INDEX IF NOT EXISTS idx_recruitment_positions_team
  ON public.recruitment_positions(team, sort_order);

CREATE OR REPLACE FUNCTION public.update_recruitment_positions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS recruitment_positions_updated_at ON public.recruitment_positions;
CREATE TRIGGER recruitment_positions_updated_at
  BEFORE UPDATE ON public.recruitment_positions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_recruitment_positions_updated_at();

ALTER TABLE public.recruitment_positions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'recruitment_positions'
      AND policyname = 'Service role full access recruitment positions'
  ) THEN
    CREATE POLICY "Service role full access recruitment positions"
      ON public.recruitment_positions FOR ALL
      USING (true)
      WITH CHECK (true);
  END IF;
END;
$$;

INSERT INTO public.recruitment_positions (id, label, team, sort_order, is_active)
VALUES
  ('network-team', 'Network Team', 'Infrastructure', 0, true),
  ('system-team', 'System Team', 'Infrastructure', 1, true),
  ('security-team', 'Security Team', 'Infrastructure', 2, true),
  ('hoi-nghi-tong-dai', 'Hội nghị & Tổng đài', 'Infrastructure', 3, true),
  ('cloud-datacenter', 'Cloud & Datacenter', 'Infrastructure', 4, true),
  ('ba', 'BA', 'Dev/DevOps', 100, true),
  ('backend-developer', 'Backend Developer', 'Dev/DevOps', 101, true),
  ('frontend-developer', 'Frontend Developer', 'Dev/DevOps', 102, true),
  ('full-stack-developer', 'Full-stack Developer', 'Dev/DevOps', 103, true),
  ('devops-platform', 'DevOps / Platform', 'Dev/DevOps', 104, true),
  ('ai-ml-engineer', 'AI / ML Engineer', 'AI', 200, true),
  ('data-analyst-engineer', 'Data Analyst / Engineer', 'AI', 201, true),
  ('ai-product-research', 'AI Product / Research', 'AI', 202, true),
  ('content-social', 'Content & Social', 'Marketing', 300, true),
  ('performance-acquisition', 'Performance & Acquisition', 'Marketing', 301, true),
  ('marketing-ops', 'Marketing Ops', 'Marketing', 302, true),
  ('b2b-sales', 'B2B Sales', 'Sales', 400, true),
  ('business-development', 'Business Development', 'Sales', 401, true),
  ('customer-success', 'Customer Success', 'Sales', 402, true)
ON CONFLICT (id) DO UPDATE
SET
  label = EXCLUDED.label,
  team = EXCLUDED.team,
  sort_order = EXCLUDED.sort_order;
