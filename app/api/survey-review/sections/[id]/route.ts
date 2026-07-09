import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { validateAdminRequest } from "@/lib/admin-auth";

// PUT /api/survey-review/sections/[id] - Edit a section (Admin only)
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
    const { section_title, section_index } = body;

    const supabase = getSupabaseAdmin();

    // Build update object
    const updateData: any = {};
    if (section_title !== undefined) updateData.section_title = section_title.trim();
    if (section_index !== undefined) updateData.section_index = section_index;
    updateData.updated_at = new Date();

    const { data: updatedSection, error } = await supabase
      .from("survey_sections")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`[PUT /api/survey-review/sections/${id}] Error:`, error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If section title changed, also sync the section_title across all existing questions in that section
    if (section_title !== undefined) {
      const { error: syncErr } = await supabase
        .from("survey_questions")
        .update({ section_title: section_title.trim() })
        .eq("survey_type", updatedSection.survey_type)
        .eq("section_index", updatedSection.section_index);

      if (syncErr) {
        console.error(`[PUT /api/survey-review/sections/${id}] Questions Sync Error:`, syncErr);
      }
    }

    return NextResponse.json({ success: true, section: updatedSection });
  } catch (err) {
    console.error("[PUT /api/survey-review/sections] Exception:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE /api/survey-review/sections/[id] - Delete a section, its questions, and re-index (Admin only)
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

    // 1. Fetch section info before delete
    const { data: targetSection, error: fetchErr } = await supabase
      .from("survey_sections")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchErr || !targetSection) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    const { survey_type, section_index } = targetSection;

    // 2. Delete the section itself
    const { error: deleteSecErr } = await supabase
      .from("survey_sections")
      .delete()
      .eq("id", id);

    if (deleteSecErr) {
      console.error(`[DELETE /api/survey-review/sections/${id}] Delete Error:`, deleteSecErr);
      return NextResponse.json({ error: deleteSecErr.message }, { status: 500 });
    }

    // 3. Delete all questions under this section_index
    const { error: deleteQuestionsErr } = await supabase
      .from("survey_questions")
      .delete()
      .eq("survey_type", survey_type)
      .eq("section_index", section_index);

    if (deleteQuestionsErr) {
      console.error(`[DELETE /api/survey-review/sections/${id}] Questions Delete Error:`, deleteQuestionsErr);
    }

    // 4. Shift down all sections with higher section_index
    const { data: higherSections, error: fetchHigherErr } = await supabase
      .from("survey_sections")
      .select("*")
      .eq("survey_type", survey_type)
      .gt("section_index", section_index)
      .order("section_index", { ascending: true });

    if (fetchHigherErr) {
      console.error(`[DELETE /api/survey-review/sections/${id}] Fetch Higher Error:`, fetchHigherErr);
    } else if (higherSections && higherSections.length > 0) {
      // Loop through each higher section and decrement index
      for (const sec of higherSections) {
        const oldIdx = sec.section_index;
        const newIdx = oldIdx - 1;

        // Update section
        await supabase
          .from("survey_sections")
          .update({ section_index: newIdx })
          .eq("id", sec.id);

        // Update matching questions
        await supabase
          .from("survey_questions")
          .update({ section_index: newIdx })
          .eq("survey_type", survey_type)
          .eq("section_index", oldIdx);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/survey-review/sections] Exception:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
