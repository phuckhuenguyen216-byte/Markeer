import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { validateAdminRequest } from "@/lib/admin-auth";

// PUT /api/survey-review/reviewers/[id] - Edit reviewer name (Admin only)
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
    const { name } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data: updatedReviewer, error } = await supabase
      .from("survey_reviewers")
      .update({ name: name.trim(), updated_at: new Date() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`[PUT /api/survey-review/reviewers/${id}] Error:`, error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, reviewer: updatedReviewer });
  } catch (err) {
    console.error("[PUT /api/survey-review/reviewers] Exception:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE /api/survey-review/reviewers/[id] - Delete reviewer (Admin only)
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
      .from("survey_reviewers")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(`[DELETE /api/survey-review/reviewers/${id}] Error:`, error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/survey-review/reviewers] Exception:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
