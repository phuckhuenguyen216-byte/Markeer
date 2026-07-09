import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { validateAdminRequest } from "@/lib/admin-auth";

// GET /api/survey-review/reviewers - Fetch all reviewers (Public)
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    const { data: reviewers, error } = await supabase
      .from("survey_reviewers")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("[GET /api/survey-review/reviewers] Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, reviewers });
  } catch (err) {
    console.error("[GET /api/survey-review/reviewers] Exception:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/survey-review/reviewers - Add a new reviewer (Admin only)
export async function POST(request: NextRequest) {
  const user = await validateAdminRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data: newReviewer, error } = await supabase
      .from("survey_reviewers")
      .insert({ name: name.trim() })
      .select()
      .single();

    if (error) {
      console.error("[POST /api/survey-review/reviewers] Insert Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, reviewer: newReviewer });
  } catch (err) {
    console.error("[POST /api/survey-review/reviewers] Exception:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
