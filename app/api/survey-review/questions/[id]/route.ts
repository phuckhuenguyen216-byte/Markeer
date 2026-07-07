import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { validateAdminRequest } from "@/lib/admin-auth";

// PUT /api/survey-review/questions/[id] - Edit a question (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await validateAdminRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const {
      section_index,
      section_title,
      question_text,
      question_type,
      options,
      is_required,
      sort_order,
    } = body;

    const supabase = getSupabaseAdmin();
    const { data: updatedQuestion, error } = await supabase
      .from("survey_questions")
      .update({
        section_index: section_index ? parseInt(section_index) : undefined,
        section_title: section_title ? section_title.trim() : undefined,
        question_text: question_text ? question_text.trim() : undefined,
        question_type,
        options,
        is_required: is_required !== undefined ? is_required : undefined,
        sort_order: sort_order !== undefined ? parseInt(sort_order) : undefined,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`[PUT /api/survey-review/questions/${id}] Error:`, error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, question: updatedQuestion });
  } catch (err) {
    console.error("[PUT /api/survey-review/questions] Exception:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE /api/survey-review/questions/[id] - Delete a question (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await validateAdminRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from("survey_questions")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(`[DELETE /api/survey-review/questions/${id}] Error:`, error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/survey-review/questions] Exception:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
