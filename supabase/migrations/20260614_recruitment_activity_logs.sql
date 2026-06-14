-- Audit trail for recruitment/admin actions.
CREATE TABLE IF NOT EXISTS public.recruitment_activity_logs (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  actor_id     TEXT,
  actor_email  TEXT,
  action       TEXT        NOT NULL,
  entity_type  TEXT        NOT NULL,
  entity_id    TEXT,
  entity_label TEXT,
  details      JSONB       NOT NULL DEFAULT '{}'::jsonb,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_recruitment_activity_logs_created
  ON public.recruitment_activity_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_recruitment_activity_logs_entity
  ON public.recruitment_activity_logs(entity_type, entity_id);

ALTER TABLE public.recruitment_activity_logs ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'recruitment_activity_logs'
      AND policyname = 'Service role full access recruitment activity logs'
  ) THEN
    CREATE POLICY "Service role full access recruitment activity logs"
      ON public.recruitment_activity_logs FOR ALL
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;
