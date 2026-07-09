-- SQL Migration for Survey Reviewers

-- 1. Create survey_reviewers Table
CREATE TABLE IF NOT EXISTS survey_reviewers (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT          NOT NULL UNIQUE,
  created_at      TIMESTAMPTZ   DEFAULT now(),
  updated_at      TIMESTAMPTZ   DEFAULT now()
);

-- Enable RLS
ALTER TABLE survey_reviewers ENABLE ROW LEVEL SECURITY;

-- Select policy (Public can view reviewers list)
DROP POLICY IF EXISTS "Public can view reviewers" ON survey_reviewers;
CREATE POLICY "Public can view reviewers"
  ON survey_reviewers FOR SELECT
  USING (true);

-- Full access for service_role
DROP POLICY IF EXISTS "Service role full access on reviewers" ON survey_reviewers;
CREATE POLICY "Service role full access on reviewers"
  ON survey_reviewers FOR ALL
  USING (true)
  WITH CHECK (true);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS survey_reviewers_updated_at ON survey_reviewers;
CREATE TRIGGER survey_reviewers_updated_at
  BEFORE UPDATE ON survey_reviewers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 2. Clear existing to prevent duplicate seed
TRUNCATE TABLE survey_reviewers;

-- 3. Seed default reviewers
INSERT INTO survey_reviewers (name) VALUES
('Anh Nhớ'),
('Lê Phi'),
('Tấn Phát'),
('Hoàng Yên'),
('Vũ Phước'),
('Diệp Hân'),
('Tấn Huy'),
('Hà Tiên'),
('Dương Mai'),
('a.Minh'),
('Thương');
