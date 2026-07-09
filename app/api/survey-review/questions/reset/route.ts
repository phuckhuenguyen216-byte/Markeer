import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { validateAdminRequest } from "@/lib/admin-auth";

const DEFAULT_SELF_SECTIONS = [
  { section_index: 2, section_title: "PHẦN 1: KPI & OUTPUT" },
  { section_index: 3, section_title: "PHẦN 2: CHẤT LƯỢNG & CHUẨN NGHỀ" },
  { section_index: 4, section_title: "PHẦN 3: BEHAVIOR & THÁI ĐỘ" },
  { section_index: 5, section_title: "PHẦN 4: ĐỐI CHIẾU TIÊU CHÍ & CAM KẾT" }
];

const DEFAULT_LEADER_SECTIONS = [
  { section_index: 2, section_title: "PHẦN 2: KPI & OUTPUT" },
  { section_index: 3, section_title: "PHẦN 3: CHẤT LƯỢNG & NĂNG LỰC" },
  { section_index: 4, section_title: "PHẦN 4: BEHAVIOR & THÁI ĐỘ" },
  { section_index: 5, section_title: "PHẦN 5: SẴN SÀNG LÊN LEVEL (Tối đa 15 điểm)" },
  { section_index: 6, section_title: "PHẦN 6: LEADER TỰ ĐÁNH GIÁ" }
];

const DEFAULT_SELF_REVIEW = [
  { section_index: 2, section_title: "PHẦN 1: KPI & OUTPUT", question_text: "[Q1] Kỳ này bạn được giao bao nhiêu task/deliverable? Hoàn thành được bao nhiêu % và đúng hạn chưa?", question_type: "textarea", options: [], is_required: true, sort_order: 1 },
  { section_index: 2, section_title: "PHẦN 1: KPI & OUTPUT", question_text: "[Q2] Liệt kê 2–3 output quan trọng nhất kỳ này. (Mỗi output kèm link evidence và số liệu cụ thể nếu có)", question_type: "textarea", options: [], is_required: true, sort_order: 2 },
  { section_index: 2, section_title: "PHẦN 1: KPI & OUTPUT", question_text: "[Q3] Tổng KPI Points bạn tự tính được kỳ này là bao nhiêu? (Kèm link/screenshot KPI log – leader sẽ cross-check)", question_type: "text", options: [], is_required: true, sort_order: 3 },
  { section_index: 2, section_title: "PHẦN 1: KPI & OUTPUT", question_text: "[Q4] Có task nào bị trễ hoặc chưa đạt không? Nếu có - lý do gì, bạn xử lý thế nào?", question_type: "textarea", options: [], is_required: true, sort_order: 4 },
  { section_index: 2, section_title: "PHẦN 1: KPI & OUTPUT", question_text: "Tự chấm điểm", question_type: "radio", options: ["1=Không đạt rõ", "2=Dưới kỳ vọng / thiếu ổn định", "3=Đạt kỳ vọng/target hiện tại", "4=Tốt, vượt mặt bằng KPI/target ở vài phần", "5=Vượt trội"], is_required: true, sort_order: 5 },
  
  { section_index: 3, section_title: "PHẦN 2: CHẤT LƯỢNG & CHUẨN NGHỀ", question_text: "[Q5] Output kỳ này có bị review trả lại nhiều không? Bao nhiêu lần phải sửa? So với kỳ trước thì sao?", question_type: "textarea", options: [], is_required: true, sort_order: 1 },
  { section_index: 3, section_title: "PHẦN 2: CHẤT LƯỢNG & CHUẨN NGHỀ", question_text: "[Q6] Phần nào trong công việc bạn tự xử lý độc lập được? Phần nào bạn vẫn cần mentor/leader hỗ trợ?", question_type: "textarea", options: [], is_required: true, sort_order: 2 },
  { section_index: 3, section_title: "PHẦN 2: CHẤT LƯỢNG & CHUẨN NGHỀ", question_text: "[Q7] Đã bàn giao đầy đủ chưa? (runbook / doc / checklist / handover). Dán link doc bàn giao nếu có.", question_type: "textarea", options: [], is_required: true, sort_order: 3 },
  
  { section_index: 4, section_title: "PHẦN 3: BEHAVIOR & THÁI ĐỘ", question_text: "[Q8] Kỳ này bạn tự làm gì NGOÀI task được giao? (VD: hỗ trợ teammate, cải tiến quy trình, tự học thêm và áp dụng, đề xuất ý tưởng)", question_type: "textarea", options: [], is_required: true, sort_order: 1 },
  { section_index: 4, section_title: "PHẦN 3: BEHAVIOR & THÁI ĐỘ", question_text: "[Q9] Kể 1 lần bạn nhận feedback / góp ý từ Mentor hoặc Leader. Bạn phản ứng thế nào và đã thay đổi gì?", question_type: "textarea", options: [], is_required: true, sort_order: 2 },
  { section_index: 4, section_title: "PHẦN 3: BEHAVIOR & THÁI ĐỘ", question_text: "[Q10] Kỳ này bạn gặp blocker / vướng mắc nào? Bạn tự xử lý hay đã leo thang (hỏi mentor) đúng lúc?", question_type: "textarea", options: [], is_required: true, sort_order: 3 },
  
  { section_index: 5, section_title: "PHẦN 4: ĐỐI CHIẾU TIÊU CHÍ & CAM KẾT", question_text: "[Q11] Đối chiếu với tiêu chí level bạn muốn lên: Bạn đã đáp ứng những điểm nào? Bạn còn thiếu điểm nào? (Liệt kê cụ thể 2–3 điểm đã đáp ứng + 1–2 điểm chưa đủ)", question_type: "textarea", options: [], is_required: true, sort_order: 1 },
  { section_index: 5, section_title: "PHẦN 4: ĐỐI CHIẾU TIÊU CHÍ & CAM KẾT", question_text: "[Q12] Nếu được lên level, bạn cam kết gì cho kỳ tiếp theo? (Scope mới, deliverable mới, ownership cụ thể gì?)", question_type: "textarea", options: [], is_required: true, sort_order: 2 },
  { section_index: 5, section_title: "PHẦN 4: ĐỐI CHIẾU TIÊU CHÍ & CAM KẾT", question_text: "[Q13] Có điều gì bạn muốn Leader/ Sếp biết thêm khi xem xét lên level không? (Context quan trọng, hoàn cảnh đặc biệt, hay đóng góp chưa được ghi nhận?)", question_type: "textarea", options: [], is_required: false, sort_order: 3 }
];

const DEFAULT_LEADER_REVIEW = [
  { section_index: 2, section_title: "PHẦN 2: KPI & OUTPUT", question_text: "Tỷ lệ hoàn thành deliverable checklist", question_type: "scale", options: { min: 1, max: 10, minLabel: "Tệ", maxLabel: "Xuất sắc" }, is_required: true, sort_order: 1 },
  { section_index: 2, section_title: "PHẦN 2: KPI & OUTPUT", question_text: "Evidence / Cross-check (Chất lượng 3 output quan trọng nhất)", question_type: "scale", options: { min: 1, max: 10, minLabel: "Không có evidence", maxLabel: "Chuẩn & evidence đầy đủ" }, is_required: true, sort_order: 2 },
  { section_index: 2, section_title: "PHẦN 2: KPI & OUTPUT", question_text: "Tiến độ & deadline cam kết", question_type: "scale", options: { min: 1, max: 10, minLabel: "Trễ và bị nhắc nhở nhiều nhưng không cải thiện", maxLabel: "Không trễ" }, is_required: true, sort_order: 3 },
  
  { section_index: 3, section_title: "PHẦN 3: CHẤT LƯỢNG & NĂNG LỰC", question_text: "Số lần phải sửa lại sau review", question_type: "scale", options: { min: 1, max: 10, minLabel: "Số lần nhiều", maxLabel: "Ít / Không cần sửa" }, is_required: true, sort_order: 1 },
  { section_index: 3, section_title: "PHẦN 3: CHẤT LƯỢNG & NĂNG LỰC", question_text: "Evidence", question_type: "text", options: [], is_required: true, sort_order: 2 },
  { section_index: 3, section_title: "PHẦN 3: CHẤT LƯỢNG & NĂNG LỰC", question_text: "Năng lực tự xử lý vs cần hỗ trợ", question_type: "scale", options: { min: 1, max: 10, minLabel: "Cần hỗ trợ liên tục", maxLabel: "Tự xử lý" }, is_required: true, sort_order: 3 },
  { section_index: 3, section_title: "PHẦN 3: CHẤT LƯỢNG & NĂNG LỰC", question_text: "Bàn giao đầy đủ (handover/runbook/doc)", question_type: "scale", options: { min: 1, max: 10, minLabel: "Không có", maxLabel: "Bàn giao đầy đủ" }, is_required: true, sort_order: 4 },
  
  { section_index: 4, section_title: "PHẦN 4: BEHAVIOR & THÁI ĐỘ", question_text: "Chủ động vượt scope — invisible work (việc ngoài KPI chính, hỗ trợ team, cải tiến quy trình)", question_type: "scale", options: { min: 1, max: 10, minLabel: "Không có", maxLabel: "Có evidence rõ, impact tốt" }, is_required: true, sort_order: 1 },
  { section_index: 4, section_title: "PHẦN 4: BEHAVIOR & THÁI ĐỘ", question_text: "Phản ứng với feedback & hành vi cải thiện", question_type: "scale", options: { min: 1, max: 10, minLabel: "Phòng thủ/né tránh", maxLabel: "Tiếp nhận & thay đổi có pattern" }, is_required: true, sort_order: 2 },
  { section_index: 4, section_title: "PHẦN 4: BEHAVIOR & THÁI ĐỘ", question_text: "Xử lý blocker & leo thang đúng lúc", question_type: "scale", options: { min: 1, max: 10, minLabel: "Hay bị block, phải nhắc liền tục", maxLabel: "Tự xử lý được + biết khi nào cần hỏi" }, is_required: true, sort_order: 3 },
  
  { section_index: 5, section_title: "PHẦN 5: SẴN SÀNG LÊN LEVEL (Tối đa 15 điểm)", question_text: "Đã đáp ứng tiêu chí deliverable của level tiếp theo chưa? (đối chiếu Career Ladder theo track)", question_type: "scale", options: { min: 1, max: 10, minLabel: "Xem xét loại hoặc cần cải thiện nhiều", maxLabel: "Hoàn toàn đáp ứng" }, is_required: true, sort_order: 1 },
  { section_index: 5, section_title: "PHẦN 5: SẴN SÀNG LÊN LEVEL (Tối đa 15 điểm)", question_text: "Cam kết kỳ tiếp: cụ thể, đo được, có ownership rõ không?", question_type: "scale", options: { min: 1, max: 10, minLabel: "Không có", maxLabel: "Cam kết cụ thể + ownership rõ" }, is_required: true, sort_order: 2 },
  { section_index: 5, section_title: "PHẦN 5: SẴN SÀNG LÊN LEVEL (Tối đa 15 điểm)", question_text: "RED FLAG GATE — Có vi phạm nghiêm trọng (L4-) trong kỳ này không?", question_type: "scale", options: { min: 1, max: 10, minLabel: "Loại", maxLabel: "Không có vi phạm" }, is_required: true, sort_order: 3 },
  
  { section_index: 6, section_title: "PHẦN 6: LEADER TỰ ĐÁNH GIÁ", question_text: "Bạn đã hỗ trợ member tốt ở điểm nào trong kỳ này? (VD: Code review kịp, 1-on-1 đều, giao task rõ scope...)", question_type: "text", options: [], is_required: true, sort_order: 1 },
  { section_index: 6, section_title: "PHẦN 6: LEADER TỰ ĐÁNH GIÁ", question_text: "Bạn còn thiếu ở đâu khi hỗ trợ member? (VD: Chưa set kỳ vọng rõ đầu sprint, ít feedback giữa kỳ...)", question_type: "text", options: [], is_required: true, sort_order: 2 },
  { section_index: 6, section_title: "PHẦN 6: LEADER TỰ ĐÁNH GIÁ", question_text: "Kỳ này có thay đổi lớn nào ảnh hưởng đến member không? (VD: Chuyển team, scope đổi giữa chừng, thiếu resource...)", question_type: "text", options: [], is_required: true, sort_order: 3 }
];

// POST /api/survey-review/questions/reset - Reset questions and sections to defaults (Admin only)
export async function POST(request: NextRequest) {
  const user = await validateAdminRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const surveyType = searchParams.get("type"); // 'self-review' or 'leader-review'

    if (!surveyType || (surveyType !== "self-review" && surveyType !== "leader-review")) {
      return NextResponse.json({ error: "Invalid or missing 'type' parameter" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // 1. Reset survey_sections
    const { error: deleteSecError } = await supabase
      .from("survey_sections")
      .delete()
      .eq("survey_type", surveyType);

    if (deleteSecError) {
      console.error("[POST /api/survey-review/questions/reset] Delete Sections Error:", deleteSecError);
      return NextResponse.json({ error: deleteSecError.message }, { status: 500 });
    }

    const defaultSections = surveyType === "self-review" ? DEFAULT_SELF_SECTIONS : DEFAULT_LEADER_SECTIONS;
    const { error: insertSecError } = await supabase
      .from("survey_sections")
      .insert(defaultSections.map(s => ({ ...s, survey_type: surveyType })));

    if (insertSecError) {
      console.error("[POST /api/survey-review/questions/reset] Insert Sections Error:", insertSecError);
      return NextResponse.json({ error: insertSecError.message }, { status: 500 });
    }

    // 2. Reset survey_questions
    const { error: deleteError } = await supabase
      .from("survey_questions")
      .delete()
      .eq("survey_type", surveyType);

    if (deleteError) {
      console.error("[POST /api/survey-review/questions/reset] Delete Error:", deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    const defaults = surveyType === "self-review" ? DEFAULT_SELF_REVIEW : DEFAULT_LEADER_REVIEW;
    const insertPayload = defaults.map((item) => ({
      survey_type: surveyType,
      section_index: item.section_index,
      section_title: item.section_title,
      question_text: item.question_text,
      question_type: item.question_type,
      options: item.options,
      is_required: item.is_required,
      sort_order: item.sort_order,
    }));

    const { error: insertError } = await supabase
      .from("survey_questions")
      .insert(insertPayload);

    if (insertError) {
      console.error("[POST /api/survey-review/questions/reset] Insert Error:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Reset to default successfully" });
  } catch (err) {
    console.error("[POST /api/survey-review/questions/reset] Exception:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
