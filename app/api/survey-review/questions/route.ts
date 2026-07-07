import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { validateAdminRequest } from "@/lib/admin-auth";

// GET /api/survey-review/questions - Get list of questions by type (self-review or leader-review)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const surveyType = searchParams.get("type"); // 'self-review' or 'leader-review'

    if (!surveyType || (surveyType !== "self-review" && surveyType !== "leader-review")) {
      return NextResponse.json({ error: "Invalid or missing 'type' parameter" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data: questions, error } = await supabase
      .from("survey_questions")
      .select("*")
      .eq("survey_type", surveyType)
      .order("section_index", { ascending: true })
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("[GET /api/survey-review/questions] Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, questions });
  } catch (err) {
    console.error("[GET /api/survey-review/questions] Exception:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/survey-review/questions - Add a new question (Admin only)
export async function POST(request: NextRequest) {
  const user = await validateAdminRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      survey_type,
      section_index,
      section_title,
      question_text,
      question_type,
      options,
      is_required,
      sort_order,
    } = body;

    // Basic Validation
    if (!survey_type || !section_title || !question_text || !question_type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data: newQuestion, error } = await supabase
      .from("survey_questions")
      .insert({
        survey_type,
        section_index: parseInt(section_index || "1"),
        section_title: section_title.trim(),
        question_text: question_text.trim(),
        question_type,
        options: options || [],
        is_required: is_required !== false,
        sort_order: parseInt(sort_order || "0"),
      })
      .select()
      .single();

    if (error) {
      console.error("[POST /api/survey-review/questions] Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, question: newQuestion });
  } catch (err) {
    console.error("[POST /api/survey-review/questions] Exception:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
