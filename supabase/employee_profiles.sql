-- Table: employee_profiles
CREATE TABLE IF NOT EXISTS employee_profiles (
  id                    UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  -- Phần 1: Thông tin cá nhân cơ bản
  full_name             TEXT        NOT NULL,
  dob                   TEXT        NOT NULL,
  gender                TEXT        NOT NULL CHECK (gender IN ('Nam', 'Nữ')),
  phone                 TEXT        NOT NULL,
  personal_email        TEXT        NOT NULL,
  
  -- Phần 2: Giấy tờ tùy thân & Cư trú
  national_id           TEXT        NOT NULL,
  id_issue_date         TEXT        NOT NULL,
  id_issue_place        TEXT        NOT NULL,
  permanent_address     TEXT        NOT NULL,
  temporary_address     TEXT        NOT NULL,
  documents_folder      TEXT        NOT NULL,
  
  -- Phần 3: Thông tin Bảo hiểm & Thuế
  tax_code              TEXT        NOT NULL,
  insurance_code        TEXT        NOT NULL,
  health_insurance_code TEXT        NOT NULL,
  
  -- Phần 4: Thông tin tài khoản ngân hàng
  bank_account          TEXT        NOT NULL,
  bank_name_branch      TEXT        NOT NULL,
  
  created_at            TIMESTAMPTZ DEFAULT now(),
  updated_at            TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_employee_profiles_email ON employee_profiles(personal_email);
CREATE INDEX IF NOT EXISTS idx_employee_profiles_created ON employee_profiles(created_at DESC);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_employee_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS employee_profiles_updated_at ON employee_profiles;
CREATE TRIGGER employee_profiles_updated_at
  BEFORE UPDATE ON employee_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_employee_profiles_updated_at();

-- RLS
ALTER TABLE employee_profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can insert
CREATE POLICY "Public can insert employee profiles"
  ON employee_profiles FOR INSERT
  WITH CHECK (true);

-- Service role full access
CREATE POLICY "Service role full access employee profiles"
  ON employee_profiles FOR ALL
  USING (true)
  WITH CHECK (true);
