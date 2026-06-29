import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { validateAdminRequest } from "@/lib/admin-auth";
import { validateEmployeeProfile } from "@/lib/employee-profile";

// Helper to strip HTML tags
function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim();
}

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

    // Generate Secure Signed URLs for Private files
    let cccd_front_url = "";
    let cccd_back_url = "";
    let other_docs_url = "";

    if (data.cccd_front_path) {
      const { data: signedData } = await supabase.storage
        .from("employee-documents")
        .createSignedUrl(data.cccd_front_path, 3600);
      cccd_front_url = signedData?.signedUrl || "";
    }

    if (data.cccd_back_path) {
      const { data: signedData } = await supabase.storage
        .from("employee-documents")
        .createSignedUrl(data.cccd_back_path, 3600);
      cccd_back_url = signedData?.signedUrl || "";
    }

    if (data.other_docs_path) {
      const { data: signedData } = await supabase.storage
        .from("employee-documents")
        .createSignedUrl(data.other_docs_path, 3600);
      other_docs_url = signedData?.signedUrl || "";
    }

    return NextResponse.json({
      ...data,
      cccd_front_url,
      cccd_back_url,
      other_docs_url,
    });
  } catch (err) {
    console.error("[GET /api/employee-profiles/[id]] Error:", err);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

// PUT /api/employee-profiles/[id] - Admin edit profile details
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await validateAdminRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    
    // Validate inputs
    const validationErrors = validateEmployeeProfile(body);
    if (validationErrors.length > 0) {
      return NextResponse.json({ errors: validationErrors }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const updateData = {
      full_name: stripHtml(body.full_name || ""),
      dob: body.dob.trim(),
      gender: body.gender,
      phone: body.phone.trim(),
      personal_email: body.personal_email.trim().toLowerCase(),
      national_id: body.national_id.trim(),
      id_issue_date: body.id_issue_date.trim(),
      id_issue_place: stripHtml(body.id_issue_place || ""),
      permanent_address: stripHtml(body.permanent_address || ""),
      temporary_address: stripHtml(body.temporary_address || ""),
      cccd_front_path: body.cccd_front_path.trim(),
      cccd_back_path: body.cccd_back_path.trim(),
      other_docs_path: (body.other_docs_path || "").trim(),
      team: stripHtml(body.team || "Tổng hợp"),
      tax_code: body.tax_code.trim(),
      insurance_code: body.insurance_code.trim(),
      health_insurance_code: body.health_insurance_code.trim(),
      bank_account: body.bank_account.trim(),
      bank_name_branch: stripHtml(body.bank_name_branch || ""),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("employee_profiles")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[PUT /api/employee-profiles/[id]] Error:", error);
      return NextResponse.json({ error: "Lỗi khi cập nhật hồ sơ" }, { status: 500 });
    }

    return NextResponse.json({ success: true, profile: data });
  } catch (err) {
    console.error("[PUT /api/employee-profiles/[id]] Error:", err);
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
