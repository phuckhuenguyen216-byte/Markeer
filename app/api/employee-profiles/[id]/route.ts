import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { validateAdminRequest } from "@/lib/admin-auth";

// GET /api/employee-profiles/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await validateAdminRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("employee_profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Không tìm thấy hồ sơ" },
        { status: 404 },
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("[GET /api/employee-profiles/[id]] Error:", err);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

// DELETE /api/employee-profiles/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await validateAdminRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const supabase = getSupabaseAdmin();

    const { error } = await supabase
      .from("employee_profiles")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/employee-profiles/[id]] Error:", err);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
