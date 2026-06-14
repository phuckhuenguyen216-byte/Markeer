-- ============================================================
-- Markee AI Marketing — Blog Schema
-- ============================================================

-- Table: markee_blog_posts
CREATE TABLE IF NOT EXISTS markee_blog_posts (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  slug          TEXT        UNIQUE NOT NULL,
  title         TEXT        NOT NULL,
  excerpt       TEXT        DEFAULT '',
  content       TEXT        DEFAULT '',
  tag           TEXT        DEFAULT 'AI Marketing',
  cover_image   TEXT        DEFAULT '',
  author        TEXT        DEFAULT 'MARKEE AI',
  status        TEXT        DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  is_featured   BOOLEAN     DEFAULT false,
  is_popular    BOOLEAN     DEFAULT false,
  view_count    INTEGER     DEFAULT 0,
  published_at  TIMESTAMPTZ DEFAULT NULL,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_markee_blog_status ON markee_blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_markee_blog_tag ON markee_blog_posts(tag);
CREATE INDEX IF NOT EXISTS idx_markee_blog_slug ON markee_blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_markee_blog_published ON markee_blog_posts(published_at DESC);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_markee_blog_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS markee_blog_posts_updated_at ON markee_blog_posts;
CREATE TRIGGER markee_blog_posts_updated_at
  BEFORE UPDATE ON markee_blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_markee_blog_updated_at();

-- RLS
ALTER TABLE markee_blog_posts ENABLE ROW LEVEL SECURITY;

-- Public read published
CREATE POLICY "Public can read published markee blog posts"
  ON markee_blog_posts FOR SELECT
  USING (status = 'published');

-- Service role full access
CREATE POLICY "Service role full access markee blog"
  ON markee_blog_posts FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- Applications Table
-- ============================================================

CREATE TABLE IF NOT EXISTS applications (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  email           TEXT        NOT NULL,
  career_journey  JSONB       DEFAULT '[]'::jsonb,
  interest_reason JSONB       DEFAULT '[]'::jsonb,
  why_apply       TEXT        DEFAULT '',
  experience      TEXT        DEFAULT '',
  skills          TEXT        DEFAULT '',
  goal            TEXT        DEFAULT '',
  work_preference JSONB       DEFAULT '{}'::jsonb,
  note            TEXT        DEFAULT '',
  strengths       TEXT        DEFAULT '',
  weaknesses      TEXT        DEFAULT '',
  expectation     TEXT        DEFAULT '',
  problem_solving JSONB       DEFAULT '[]'::jsonb,
  feedback_response JSONB     DEFAULT '[]'::jsonb,
  full_name       TEXT        NOT NULL,
  dob             TEXT        DEFAULT '',
  phone           TEXT        DEFAULT '',
  school          TEXT        DEFAULT '',
  enrollment      TEXT        DEFAULT '',
  graduation      TEXT        DEFAULT '',
  cv              TEXT        DEFAULT '',
  status          TEXT        DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'interviewed', 'accepted', 'rejected', 'resigned')),
  admin_notes     TEXT        DEFAULT '',
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_email ON applications(email);
CREATE INDEX IF NOT EXISTS idx_applications_created ON applications(created_at DESC);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_applications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS applications_updated_at ON applications;
CREATE TRIGGER applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION update_applications_updated_at();

-- RLS
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (public form submission)
CREATE POLICY "Public can insert applications"
  ON applications FOR INSERT
  WITH CHECK (true);

-- Service role full access
CREATE POLICY "Service role full access applications"
  ON applications FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- Recruitment Leaders
-- Shared leader directory for admin recruitment management.
-- ============================================================

CREATE TABLE IF NOT EXISTS recruitment_leaders (
  id          TEXT        PRIMARY KEY DEFAULT ('leader-' || replace(gen_random_uuid()::text, '-', '')),
  name        TEXT        NOT NULL CHECK (length(trim(name)) > 0),
  team        TEXT        NOT NULL CHECK (team IN ('Marketing', 'Dev/DevOps', 'AI', 'Infrastructure', 'Sales', 'Other')),
  is_active   BOOLEAN     DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_recruitment_leaders_active
  ON recruitment_leaders(is_active, created_at);

CREATE OR REPLACE FUNCTION update_recruitment_leaders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS recruitment_leaders_updated_at ON recruitment_leaders;
CREATE TRIGGER recruitment_leaders_updated_at
  BEFORE UPDATE ON recruitment_leaders
  FOR EACH ROW
  EXECUTE FUNCTION update_recruitment_leaders_updated_at();

ALTER TABLE recruitment_leaders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access recruitment leaders"
  ON recruitment_leaders FOR ALL
  USING (true)
  WITH CHECK (true);

INSERT INTO recruitment_leaders (id, name, team)
VALUES
  ('leader-mkt', 'Thuong', 'Marketing'),
  ('leader-dev', 'Dev Lead', 'Dev/DevOps'),
  ('leader-ai', 'AI Lead', 'AI')
ON CONFLICT (id) DO UPDATE
SET
  name = EXCLUDED.name,
  team = EXCLUDED.team,
  is_active = true;

-- ============================================================
-- Recruitment Activity Logs
-- Audit trail for admin recruitment actions.
-- ============================================================

CREATE TABLE IF NOT EXISTS recruitment_activity_logs (
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
  ON recruitment_activity_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_recruitment_activity_logs_entity
  ON recruitment_activity_logs(entity_type, entity_id);

ALTER TABLE recruitment_activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access recruitment activity logs"
  ON recruitment_activity_logs FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- Recruitment Positions
-- Controls which positions are visible on the public application form.
-- ============================================================

CREATE TABLE IF NOT EXISTS recruitment_positions (
  id          TEXT        PRIMARY KEY,
  label       TEXT        NOT NULL UNIQUE CHECK (length(trim(label)) > 0),
  team        TEXT        NOT NULL CHECK (team IN ('Infrastructure', 'Dev/DevOps', 'AI', 'Marketing', 'Sales')),
  sort_order  INTEGER     NOT NULL DEFAULT 0,
  is_active   BOOLEAN     NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_recruitment_positions_active
  ON recruitment_positions(is_active, sort_order);

CREATE INDEX IF NOT EXISTS idx_recruitment_positions_team
  ON recruitment_positions(team, sort_order);

CREATE OR REPLACE FUNCTION update_recruitment_positions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS recruitment_positions_updated_at ON recruitment_positions;
CREATE TRIGGER recruitment_positions_updated_at
  BEFORE UPDATE ON recruitment_positions
  FOR EACH ROW
  EXECUTE FUNCTION update_recruitment_positions_updated_at();

ALTER TABLE recruitment_positions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access recruitment positions"
  ON recruitment_positions FOR ALL
  USING (true)
  WITH CHECK (true);

INSERT INTO recruitment_positions (id, label, team, sort_order, is_active)
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
