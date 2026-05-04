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
  status          TEXT        DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'interviewed', 'accepted', 'rejected')),
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
