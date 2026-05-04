import { NextRequest, NextResponse } from "next/server";
import { validateAdminRequest } from "@/lib/admin-auth";
import { syncAllToSheet } from "@/lib/google-sheets";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

// POST /api/applications/sync-sheet - Sync all applications to Google Sheets.
export async function POST(request: NextRequest) {
  const user = await validateAdminRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const success = await syncAllToSheet(data || []);

    if (!success) {
      return NextResponse.json(
        {
          error:
            "Google Sheets is not configured in lib/server-config.ts for this demo build.",
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      count: (data || []).length,
      message: `Synced ${(data || []).length} applications to Google Sheets`,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
