"use client";
import { use } from "react";
import BlogForm from "../../components/BlogForm";

export default function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <BlogForm isNew={false} postId={id} />;
}
