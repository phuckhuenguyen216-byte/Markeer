-- SQL Migration for Dynamic Survey Questions and submissions

-- 1. Create survey_questions Table
CREATE TABLE IF NOT EXISTS survey_questions (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_type     TEXT          NOT NULL, -- 'self-review' | 'leader-review'
  section_index   INT           NOT NULL, -- 1, 2, 3...
  section_title   TEXT          NOT NULL, -- e.g., 'PHẦN 1: KPI & OUTPUT'
  question_text   TEXT          NOT NULL,
  question_type   TEXT          NOT NULL, -- 'text' | 'textarea' | 'radio' | 'scale'
  options         JSONB         NOT NULL DEFAULT '[]', -- JSON array of strings or settings object
  is_required     BOOLEAN       NOT NULL DEFAULT true,
  sort_order      INT           NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ   DEFAULT now(),
  updated_at      TIMESTAMPTZ   DEFAULT now()
);

-- Indexing for speed
CREATE INDEX IF NOT EXISTS idx_survey_questions_type ON survey_questions(survey_type);
CREATE INDEX IF NOT EXISTS idx_survey_questions_order ON survey_questions(section_index, sort_order);

-- Enable RLS
ALTER TABLE survey_questions ENABLE ROW LEVEL SECURITY;

-- Select policy (Public can view questions)
DROP POLICY IF EXISTS "Public can view questions" ON survey_questions;
CREATE POLICY "Public can view questions"
  ON survey_questions FOR SELECT
  USING (true);

-- Full access for service_role
DROP POLICY IF EXISTS "Service role full access on questions" ON survey_questions;
CREATE POLICY "Service role full access on questions"
  ON survey_questions FOR ALL
  USING (true)
  WITH CHECK (true);

-- Updated_at Trigger for questions
DROP TRIGGER IF EXISTS survey_questions_updated_at ON survey_questions;
CREATE TRIGGER survey_questions_updated_at
  BEFORE UPDATE ON survey_questions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 2. Modify self_reviews and leader_reviews tables to use answers JSONB column
ALTER TABLE self_reviews DROP COLUMN IF EXISTS kpi_answers;
ALTER TABLE self_reviews DROP COLUMN IF EXISTS quality_answers;
ALTER TABLE self_reviews DROP COLUMN IF EXISTS behavior_answers;
ALTER TABLE self_reviews DROP COLUMN IF EXISTS commitment_answers;
ALTER TABLE self_reviews ADD COLUMN IF NOT EXISTS answers JSONB NOT NULL DEFAULT '[]';

ALTER TABLE leader_reviews DROP COLUMN IF EXISTS kpi_answers;
ALTER TABLE leader_reviews DROP COLUMN IF EXISTS quality_answers;
ALTER TABLE leader_reviews DROP COLUMN IF EXISTS behavior_answers;
ALTER TABLE leader_reviews DROP COLUMN IF EXISTS readiness_answers;
ALTER TABLE leader_reviews DROP COLUMN IF EXISTS self_eval_answers;
ALTER TABLE leader_reviews ADD COLUMN IF NOT EXISTS answers JSONB NOT NULL DEFAULT '[]';

-- 3. Clear existing questions to avoid duplicate seeds on rerun
TRUNCATE TABLE survey_questions;

-- 4. Seed Self-Review Questions (13 questions)
INSERT INTO survey_questions (survey_type, section_index, section_title, question_text, question_type, options, is_required, sort_order) VALUES
('self-review', 2, 'PHẦN 1: KPI & OUTPUT', '[Q1] Kỳ này bạn được giao bao nhiêu task/deliverable? Hoàn thành được bao nhiêu % và đúng hạn chưa?', 'textarea', '[]', true, 1),
('self-review', 2, 'PHẦN 1: KPI & OUTPUT', '[Q2] Liệt kê 2–3 output quan trọng nhất kỳ này. (Mỗi output kèm link evidence và số liệu cụ thể nếu có)', 'textarea', '[]', true, 2),
('self-review', 2, 'PHẦN 1: KPI & OUTPUT', '[Q3] Tổng KPI Points bạn tự tính được kỳ này là bao nhiêu? (Kèm link/screenshot KPI log – leader sẽ cross-check)', 'text', '[]', true, 3),
('self-review', 2, 'PHẦN 1: KPI & OUTPUT', '[Q4] Có task nào bị trễ hoặc chưa đạt không? Nếu có - lý do gì, bạn xử lý thế nào?', 'textarea', '[]', true, 4),
('self-review', 2, 'PHẦN 1: KPI & OUTPUT', 'Tự chấm điểm', 'radio', '["1=Không đạt rõ", "2=Dưới kỳ vọng / thiếu ổn định", "3=Đạt kỳ vọng/target hiện tại", "4=Tốt, vượt mặt bằng KPI/target ở vài phần", "5=Vượt trội"]', true, 5),

('self-review', 3, 'PHẦN 2: CHẤT LƯỢNG & CHUẨN NGHỀ', '[Q5] Output kỳ này có bị review trả lại nhiều không? Bao nhiêu lần phải sửa? So với kỳ trước thì sao?', 'textarea', '[]', true, 1),
('self-review', 3, 'PHẦN 2: CHẤT LƯỢNG & CHUẨN NGHỀ', '[Q6] Phần nào trong công việc bạn tự xử lý độc lập được? Phần nào bạn vẫn cần mentor/leader hỗ trợ?', 'textarea', '[]', true, 2),
('self-review', 3, 'PHẦN 2: CHẤT LƯỢNG & CHUẨN NGHỀ', '[Q7] Đã bàn giao đầy đủ chưa? (runbook / doc / checklist / handover). Dán link doc bàn giao nếu có.', 'textarea', '[]', true, 3),

('self-review', 4, 'PHẦN 3: BEHAVIOR & THÁI ĐỘ', '[Q8] Kỳ này bạn tự làm gì NGOÀI task được giao? (VD: hỗ trợ teammate, cải tiến quy trình, tự học thêm và áp dụng, đề xuất ý tưởng)', 'textarea', '[]', true, 1),
('self-review', 4, 'PHẦN 3: BEHAVIOR & THÁI ĐỘ', '[Q9] Kể 1 lần bạn nhận feedback / góp ý từ Mentor hoặc Leader. Bạn phản ứng thế nào và đã thay đổi gì?', 'textarea', '[]', true, 2),
('self-review', 4, 'PHẦN 3: BEHAVIOR & THÁI ĐỘ', '[Q10] Kỳ này bạn gặp blocker / vướng mắc nào? Bạn tự xử lý hay đã leo thang (hỏi mentor) đúng lúc?', 'textarea', '[]', true, 3),

('self-review', 5, 'PHẦN 2: ĐỐI CHIẾU TIÊU CHÍ & CAM KẾT', '[Q11] Đối chiếu với tiêu chí level bạn muốn lên: Bạn đã đáp ứng những điểm nào? Bạn còn thiếu điểm nào? (Liệt kê cụ thể 2–3 điểm đã đáp ứng + 1–2 điểm chưa đủ)', 'textarea', '[]', true, 1),
('self-review', 5, 'PHẦN 2: ĐỐI CHIẾU TIÊU CHÍ & CAM KẾT', '[Q12] Nếu được lên level, bạn cam kết gì cho kỳ tiếp theo? (Scope mới, deliverable mới, ownership cụ thể gì?)', 'textarea', '[]', true, 2),
('self-review', 5, 'PHẦN 2: ĐỐI CHIẾU TIÊU CHÍ & CAM KẾT', '[Q13] Có điều gì bạn muốn Leader/ Sếp biết thêm khi xem xét lên level không? (Context quan trọng, hoàn cảnh đặc biệt, hay đóng góp chưa được ghi nhận?)', 'textarea', '[]', false, 3);

-- 5. Seed Leader-Review Questions (16 questions)
INSERT INTO survey_questions (survey_type, section_index, section_title, question_text, question_type, options, is_required, sort_order) VALUES
('leader-review', 2, 'PHẦN 2: KPI & OUTPUT', 'Tỷ lệ hoàn thành deliverable checklist', 'scale', '{"min": 1, "max": 10, "minLabel": "Tệ", "maxLabel": "Xuất sắc"}', true, 1),
('leader-review', 2, 'PHẦN 2: KPI & OUTPUT', 'Evidence / Cross-check (Chất lượng 3 output quan trọng nhất)', 'scale', '{"min": 1, "max": 10, "minLabel": "Không có evidence", "maxLabel": "Chuẩn & evidence đầy đủ"}', true, 2),
('leader-review', 2, 'PHẦN 2: KPI & OUTPUT', 'Tiến độ & deadline cam kết', 'scale', '{"min": 1, "max": 10, "minLabel": "Trễ và bị nhắc nhở nhiều nhưng không cải thiện", "maxLabel": "Không trễ"}', true, 3),

('leader-review', 3, 'PHẦN 3: CHẤT LƯỢNG & NĂNG LỰC', 'Số lần phải sửa lại sau review', 'scale', '{"min": 1, "max": 10, "minLabel": "Số lần nhiều", "maxLabel": "Ít / Không cần sửa"}', true, 1),
('leader-review', 3, 'PHẦN 3: CHẤT LƯỢNG & NĂNG LỰC', 'Evidence', 'text', '[]', true, 2),
('leader-review', 3, 'PHẦN 3: CHẤT LƯỢNG & NĂNG LỰC', 'Năng lực tự xử lý vs cần hỗ trợ', 'scale', '{"min": 1, "max": 10, "minLabel": "Cần hỗ trợ liên tục", "maxLabel": "Tự xử lý"}', true, 3),
('leader-review', 3, 'PHẦN 3: CHẤT LƯỢNG & NĂNG LỰC', 'Bàn giao đầy đủ (handover/runbook/doc)', 'scale', '{"min": 1, "max": 10, "minLabel": "Không có", "maxLabel": "Bàn giao đầy đủ"}', true, 4),

('leader-review', 4, 'PHẦN 4: BEHAVIOR & THÁI ĐỘ', 'Chủ động vượt scope — invisible work (việc ngoài KPI chính, hỗ trợ team, cải tiến quy trình)', 'scale', '{"min": 1, "max": 10, "minLabel": "Không có", "maxLabel": "Có evidence rõ, impact tốt"}', true, 1),
('leader-review', 4, 'PHẦN 4: BEHAVIOR & THÁI ĐỘ', 'Phản ứng với feedback & hành vi cải thiện', 'scale', '{"min": 1, "max": 10, "minLabel": "Phòng thủ/né tránh", "maxLabel": "Tiếp nhận & thay đổi có pattern"}', true, 2),
('leader-review', 4, 'PHẦN 4: BEHAVIOR & THÁI ĐỘ', 'Xử lý blocker & leo thang đúng lúc', 'scale', '{"min": 1, "max": 10, "minLabel": "Hay bị block, phải nhắc liền tục", "maxLabel": "Tự xử lý được + biết khi nào cần hỏi"}', true, 3),

('leader-review', 5, 'PHẦN 5: SẴN SÀNG LÊN LEVEL (Tối đa 15 điểm)', 'Đã đáp ứng tiêu chí deliverable của level tiếp theo chưa? (đối chiếu Career Ladder theo track)', 'scale', '{"min": 1, "max": 10, "minLabel": "Xem xét loại hoặc cần cải thiện nhiều", "maxLabel": "Hoàn toàn đáp ứng"}', true, 1),
('leader-review', 5, 'PHẦN 5: SẴN SÀNG LÊN LEVEL (Tối đa 15 điểm)', 'Cam kết kỳ tiếp: cụ thể, đo được, có ownership rõ không?', 'scale', '{"min": 1, "max": 10, "minLabel": "Không có", "maxLabel": "Cam kết cụ thể + ownership rõ"}', true, 2),
('leader-review', 5, 'PHẦN 5: SẴN SÀNG LÊN LEVEL (Tối đa 15 điểm)', 'RED FLAG GATE — Có vi phạm nghiêm trọng (L4-) trong kỳ này không?', 'scale', '{"min": 1, "max": 10, "minLabel": "Loại", "maxLabel": "Không có vi phạm"}', true, 3),

('leader-review', 6, 'PHẦN 6: LEADER TỰ ĐÁNH GIÁ', 'Bạn đã hỗ trợ member tốt ở điểm nào trong kỳ này? (VD: Code review kịp, 1-on-1 đều, giao task rõ scope...)', 'text', '[]', true, 1),
('leader-review', 6, 'PHẦN 6: LEADER TỰ ĐÁNH GIÁ', 'Bạn còn thiếu ở đâu khi hỗ trợ member? (VD: Chưa set kỳ vọng rõ đầu sprint, ít feedback giữa kỳ...)', 'text', '[]', true, 2),
('leader-review', 6, 'PHẦN 6: LEADER TỰ ĐÁNH GIÁ', 'Kỳ này có thay đổi lớn nào ảnh hưởng đến member không? (VD: Chuyển team, scope đổi giữa chừng, thiếu resource...)', 'text', '[]', true, 3);
