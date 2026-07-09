-- SQL Migration for Dynamic Survey Sections

-- 1. Create survey_sections Table
CREATE TABLE IF NOT EXISTS survey_sections (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_type     TEXT          NOT NULL, -- 'self-review' | 'leader-review'
  section_index   INT           NOT NULL, -- e.g., 2, 3, 4...
  section_title   TEXT          NOT NULL,
  created_at      TIMESTAMPTZ   DEFAULT now(),
  updated_at      TIMESTAMPTZ   DEFAULT now()
);

-- Indexing for speed
CREATE INDEX IF NOT EXISTS idx_survey_sections_type ON survey_sections(survey_type);
CREATE INDEX IF NOT EXISTS idx_survey_sections_index ON survey_sections(survey_type, section_index);

-- Enable RLS
ALTER TABLE survey_sections ENABLE ROW LEVEL SECURITY;

-- Select policy (Public can view sections)
DROP POLICY IF EXISTS "Public can view sections" ON survey_sections;
CREATE POLICY "Public can view sections"
  ON survey_sections FOR SELECT
  USING (true);

-- Full access for service_role
DROP POLICY IF EXISTS "Service role full access on sections" ON survey_sections;
CREATE POLICY "Service role full access on sections"
  ON survey_sections FOR ALL
  USING (true)
  WITH CHECK (true);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS survey_sections_updated_at ON survey_sections;
CREATE TRIGGER survey_sections_updated_at
  BEFORE UPDATE ON survey_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 2. Clear existing sections to avoid duplicate seeds
TRUNCATE TABLE survey_sections;

-- 3. Seed initial sections for Self-Review
INSERT INTO survey_sections (survey_type, section_index, section_title) VALUES
('self-review', 2, 'PHẦN 1: KPI & OUTPUT'),
('self-review', 3, 'PHẦN 2: CHẤT LƯỢNG & CHUẨN NGHỀ'),
('self-review', 4, 'PHẦN 3: BEHAVIOR & THÁI ĐỘ'),
('self-review', 5, 'PHẦN 4: ĐỐI CHIẾU TIÊU CHÍ & CAM KẾT');

-- 4. Seed initial sections for Leader-Review
INSERT INTO survey_sections (survey_type, section_index, section_title) VALUES
('leader-review', 2, 'PHẦN 2: KPI & OUTPUT'),
('leader-review', 3, 'PHẦN 3: CHẤT LƯỢNG & NĂNG LỰC'),
('leader-review', 4, 'PHẦN 4: BEHAVIOR & THÁI ĐỘ'),
('leader-review', 5, 'PHẦN 5: SẴN SÀNG LÊN LEVEL (Tối đa 15 điểm)'),
('leader-review', 6, 'PHẦN 6: LEADER TỰ ĐÁNH GIÁ');
