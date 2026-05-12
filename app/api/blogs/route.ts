/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

// GET /api/blogs — Lấy danh sách bài viết
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const tag = searchParams.get("tag");
    const featured = searchParams.get("featured");
    const popular = searchParams.get("popular");
    const adminMode = searchParams.get("admin") === "true";
    const limit = parseInt(searchParams.get("limit") || "50");
    const page = parseInt(searchParams.get("page") || "1");
    const offset = (page - 1) * limit;

    // Admin mode requires authentication
    let supabase;
    if (adminMode) {
      const { validateAdminRequest } = await import("@/lib/admin-auth");
      const user = await validateAdminRequest(request);
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      supabase = getSupabaseAdmin();
    } else {
      supabase = getSupabase();
    }
    let query = supabase
      .from("markee_blog_posts")
      .select("*", { count: "exact" })
      .order("published_at", { ascending: false, nullsFirst: false });

    if (status) query = query.eq("status", status);
    if (tag) query = query.eq("tag", tag);
    if (featured === "true") query = query.eq("is_featured", true);
    if (popular === "true") query = query.eq("is_popular", true);

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      posts: data,
      total: count,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

// POST /api/blogs — Tạo bài viết mới (dùng cho autopost)
export async function POST(request: NextRequest) {
  const { validateAdminRequest } = await import("@/lib/admin-auth");
  const user = await validateAdminRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (!body.title?.trim()) {
      return NextResponse.json(
        { error: "Tiêu đề (title) không được để trống" },
        { status: 400 },
      );
    }

    let slug = body.slug?.trim();
    if (!slug) {
      slug = body.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
    }
    slug = `${slug}-${Date.now()}`;

    const insert = {
      slug,
      title: body.title.trim(),
      excerpt: body.excerpt?.trim() ?? "",
      content: body.content ?? "",
      tag: body.tag ?? "AI Marketing",
      cover_image: body.cover_image ?? body.coverImage ?? "",
      author: body.author ?? "MARKEE AI",
      status: body.status ?? "published",
      is_featured: body.is_featured ?? body.isFeatured ?? false,
      is_popular: body.is_popular ?? body.isPopular ?? false,
      published_at:
        body.status === "published"
          ? (body.published_at ?? new Date().toISOString())
          : null,
    };

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("markee_blog_posts")
      .insert([insert])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Tạo bài viết thành công",
      post: data,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("POST /api/blogs error:", message);
    return NextResponse.json({ error: "Lỗi tạo bài viết" }, { status: 500 });
  }
}
