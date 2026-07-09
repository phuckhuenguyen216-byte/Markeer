import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { validateAdminRequest } from "@/lib/admin-auth";

// GET /api/survey-review/sections - Get list of sections by type (self-review or leader-review)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const surveyType = searchParams.get("type"); // 'self-review' or 'leader-review'

    if (!surveyType || (surveyType !== "self-review" && surveyType !== "leader-review")) {
      return NextResponse.json({ error: "Invalid or missing 'type' parameter" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data: sections, error } = await supabase
      .from("survey_sections")
      .select("*")
      .eq("survey_type", surveyType)
      .order("section_index", { ascending: true });

    if (error) {
      console.error("[GET /api/survey-review/sections] Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, sections });
  } catch (err) {
    console.error("[GET /api/survey-review/sections] Exception:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/survey-review/sections - Add a new section (Admin only)
export async function POST(request: NextRequest) {
  const user = await validateAdminRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { survey_type, section_title } = body;

    if (!survey_type || !section_title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Find the current maximum section_index for this survey_type
    const { data: existingSections, error: fetchErr } = await supabase
      .from("survey_sections")
      .select("section_index")
      .eq("survey_type", survey_type)
      .order("section_index", { ascending: false });

    if (fetchErr) {
      console.error("[POST /api/survey-review/sections] Fetch Error:", fetchErr);
      return NextResponse.json({ error: fetchErr.message }, { status: 500 });
    }

    // Default starting dynamic index is 2
    let newIndex = 2;
    if (existingSections && existingSections.length > 0) {
      newIndex = existingSections[0].section_index + 1;
    }

    // Insert new section
    const { data: newSection, error: insertErr } = await supabase
      .from("survey_sections")
      .insert({
        survey_type,
        section_index: newIndex,
        section_title: section_title.trim()
      })
      .select()
      .single();

    if (insertErr) {
      console.error("[POST /api/survey-review/sections] Insert Error:", insertErr);
      return NextResponse.json({ error: insertErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, section: newSection });
  } catch (err) {
    console.error("[POST /api/survey-review/sections] Exception:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
