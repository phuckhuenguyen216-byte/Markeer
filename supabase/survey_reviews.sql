-- SQL Script for Level Review Surveys (Self Review & Leader Review)

-- 1. Table self_reviews
CREATE TABLE IF NOT EXISTS self_reviews (
  id                        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name                 TEXT        NOT NULL,
  team                      TEXT        NOT NULL,
  current_level             TEXT        NOT NULL,
  target_level              TEXT        NOT NULL,
  review_period             TEXT        NOT NULL,
  assigned_mentors_leaders  JSONB       NOT NULL, -- list of reviewers & roles
  kpi_answers               JSONB       NOT NULL, -- Q1-Q4 answers + score
  quality_answers           JSONB       NOT NULL, -- Q5-Q7 answers
  behavior_answers          JSONB       NOT NULL, -- Q8-Q10 answers
  commitment_answers        JSONB       NOT NULL, -- Q11-Q13 answers
  status                    TEXT        NOT NULL DEFAULT 'Đang xem xét', -- 'Đang xem xét' | 'Đã duyệt lên Level' | 'Từ chối lên Level'
  created_at                TIMESTAMPTZ DEFAULT now(),
  updated_at                TIMESTAMPTZ DEFAULT now()
);

-- Indexes for self_reviews
CREATE INDEX IF NOT EXISTS idx_self_reviews_name ON self_reviews(full_name);
CREATE INDEX IF NOT EXISTS idx_self_reviews_created ON self_reviews(created_at DESC);

-- 2. Table leader_reviews
CREATE TABLE IF NOT EXISTS leader_reviews (
  id                        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  member_name               TEXT        NOT NULL,
  current_level             TEXT        NOT NULL,
  target_level              TEXT        NOT NULL,
  review_period             TEXT        NOT NULL,
  assigned_mentors_leaders  JSONB       NOT NULL,
  management_time           TEXT        NOT NULL,
  kpi_answers               JSONB       NOT NULL,
  quality_answers           JSONB       NOT NULL,
  behavior_answers          JSONB       NOT NULL,
  readiness_answers         JSONB       NOT NULL,
  self_eval_answers         JSONB       NOT NULL,
  status                    TEXT        NOT NULL DEFAULT 'Đang xem xét',
  created_at                TIMESTAMPTZ DEFAULT now(),
  updated_at                TIMESTAMPTZ DEFAULT now()
);

-- Indexes for leader_reviews
CREATE INDEX IF NOT EXISTS idx_leader_reviews_name ON leader_reviews(member_name);
CREATE INDEX IF NOT EXISTS idx_leader_reviews_created ON leader_reviews(created_at DESC);

-- Generic updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for self_reviews
DROP TRIGGER IF EXISTS self_reviews_updated_at ON self_reviews;
CREATE TRIGGER self_reviews_updated_at
  BEFORE UPDATE ON self_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for leader_reviews
DROP TRIGGER IF EXISTS leader_reviews_updated_at ON leader_reviews;
CREATE TRIGGER leader_reviews_updated_at
  BEFORE UPDATE ON leader_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE self_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE leader_reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can insert self_reviews
DROP POLICY IF EXISTS "Public can insert self_reviews" ON self_reviews;
CREATE POLICY "Public can insert self_reviews"
  ON self_reviews FOR INSERT
  WITH CHECK (true);

-- Service role full access for self_reviews
DROP POLICY IF EXISTS "Service role full access self_reviews" ON self_reviews;
CREATE POLICY "Service role full access self_reviews"
  ON self_reviews FOR ALL
  USING (true)
  WITH CHECK (true);

-- Anyone can insert leader_reviews
DROP POLICY IF EXISTS "Public can insert leader_reviews" ON leader_reviews;
CREATE POLICY "Public can insert leader_reviews"
  ON leader_reviews FOR INSERT
  WITH CHECK (true);

-- Service role full access for leader_reviews
DROP POLICY IF EXISTS "Service role full access leader_reviews" ON leader_reviews;
CREATE POLICY "Service role full access leader_reviews"
  ON leader_reviews FOR ALL
  USING (true)
  WITH CHECK (true);
