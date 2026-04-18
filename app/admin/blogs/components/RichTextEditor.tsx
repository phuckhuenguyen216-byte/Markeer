"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import TiptapLink from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { useEffect, useCallback, useState } from "react";

function ToolbarBtn({
  onClick,
  active,
  title,
  children,
  disabled,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded-lg transition-all ${active ? "bg-red-100 text-[#dc2626]" : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"} disabled:opacity-30 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-gray-200 mx-0.5" />;
}

const BLOG_TEMPLATE = `
<h2>Giới thiệu</h2>
<p>Viết 1–2 câu tóm tắt bài viết tại đây. Nêu rõ bài viết sẽ giúp người đọc điều gì.</p>

<h2>Mục 1: [Tiêu đề mục đầu tiên]</h2>
<p>Nội dung mục 1. Viết ngắn gọn, dễ đọc. Mỗi đoạn khoảng 3–5 câu.</p>

<h3>Gợi ý chi tiết</h3>
<ul>
  <li>Điểm nổi bật thứ nhất</li>
  <li>Điểm nổi bật thứ hai</li>
  <li>Điểm nổi bật thứ ba</li>
</ul>

<h2>Mục 2: [Tiêu đề mục thứ hai]</h2>
<p>Nội dung mục 2. Có thể thêm hình ảnh bên dưới để minh họa.</p>

<h2>Mục 3: [Tiêu đề mục thứ ba]</h2>
<p>Nội dung mục 3.</p>

<blockquote>Trích dẫn hoặc điểm nhấn quan trọng của bài viết — dùng câu gọn, có ấn tượng.</blockquote>

<h2>Kết luận</h2>
<p>Tóm tắt lại nội dung chính. Gợi ý bước tiếp theo cho người đọc.</p>
`.trim();

export default function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Underline,
      TiptapImage.configure({ inline: false, allowBase64: false }),
      TiptapLink.configure({
        openOnClick: false,
        HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" },
      }),
      Placeholder.configure({
        placeholder: "Bắt đầu viết nội dung bài viết tại đây...",
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none min-h-[400px] px-5 py-4 text-gray-800 leading-relaxed",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (
      value !== current &&
      (value === "" || value === "<p></p>") &&
      current !== "<p></p>"
    )
      return;
    if (value !== current) editor.commands.setContent(value || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const autoFormat = useCallback(() => {
    if (!editor) return;
    const raw = editor.getText();
    if (!raw.trim()) return;
    const lines = raw.split("\n");
    const blocks: string[] = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i].trim();
      if (!line) {
        i++;
        continue;
      }
      if (/^\d+[.)]\s/.test(line)) {
        const items: string[] = [];
        while (i < lines.length && /^\d+[.)]\s/.test(lines[i].trim())) {
          items.push(`<li>${lines[i].trim().replace(/^\d+[.)]\s+/, "")}</li>`);
          i++;
        }
        blocks.push(`<ol>${items.join("")}</ol>`);
        continue;
      }
      if (/^[-•*+]\s/.test(line)) {
        const items: string[] = [];
        while (i < lines.length && /^[-•*+]\s/.test(lines[i].trim())) {
          items.push(`<li>${lines[i].trim().replace(/^[-•*+]\s+/, "")}</li>`);
          i++;
        }
        blocks.push(`<ul>${items.join("")}</ul>`);
        continue;
      }
      if (/^>/.test(line) || (/^"/.test(line) && line.endsWith('"'))) {
        const text = line.replace(/^>\s*/, "").replace(/^"|"$/g, "");
        blocks.push(`<blockquote>${text}</blockquote>`);
        i++;
        continue;
      }
      const nextLine = (lines[i + 1] || "").trim();
      const isHeading =
        line.length <= 60 &&
        !line.endsWith(".") &&
        !line.endsWith(",") &&
        (nextLine === "" || nextLine.length <= 60) &&
        lines.length > 3;
      if (isHeading) {
        const isH3 =
          line.length <= 40 &&
          blocks.length > 0 &&
          (blocks[blocks.length - 1].startsWith("<h2>") ||
            blocks[blocks.length - 1].startsWith("<ul>") ||
            blocks[blocks.length - 1].startsWith("<ol>"));
        blocks.push(isH3 ? `<h3>${line}</h3>` : `<h2>${line}</h2>`);
        i++;
        continue;
      }
      const paraLines: string[] = [];
      while (i < lines.length) {
        const l = lines[i].trim();
        if (!l) {
          i++;
          break;
        }
        if (/^[-•*+]\s/.test(l) || /^\d+[.)]\s/.test(l) || /^>/.test(l)) break;
        paraLines.push(l);
        i++;
      }
      if (paraLines.length > 0) blocks.push(`<p>${paraLines.join(" ")}</p>`);
    }
    editor.chain().focus().setContent(blocks.join("\n")).run();
  }, [editor]);

  const openLinkDialog = useCallback(() => {
    const prev = editor?.getAttributes("link").href || "";
    setLinkUrl(prev);
    setLinkDialogOpen(true);
  }, [editor]);

  const applyLink = () => {
    if (!editor) return;
    if (linkUrl.trim() === "")
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    else
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl.trim() })
        .run();
    setLinkDialogOpen(false);
    setLinkUrl("");
  };

  const applyImage = () => {
    if (!editor || !imageUrl.trim()) return;
    editor.chain().focus().setImage({ src: imageUrl.trim() }).run();
    setImageDialogOpen(false);
    setImageUrl("");
  };

  if (!editor) return null;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:border-red-300 focus-within:ring-2 focus-within:ring-red-50 transition">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-gray-100 bg-gray-50/70">
        <ToolbarBtn
          onClick={() => editor.chain().focus().undo().run()}
          title="Hoàn tác"
          disabled={!editor.can().undo()}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M2 6h6a3 3 0 0 1 0 6H5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M2 6l3-3M2 6l3 3"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().redo().run()}
          title="Làm lại"
          disabled={!editor.can().redo()}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M12 6H6a3 3 0 0 0 0 6h3"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M12 6l-3-3M12 6l-3 3"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </ToolbarBtn>
        <Divider />
        <ToolbarBtn
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={editor.isActive("heading", { level: 2 })}
          title="Tiêu đề lớn (H2)"
        >
          <svg width="16" height="14" viewBox="0 0 16 14" fill="none">
            <path
              d="M2 2v10M2 7h6M8 2v10"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <path
              d="M11 8.5c0-1 .8-1.5 1.5-1.5s1.5.5 1.5 1.5c0 .8-.6 1.3-1.5 2.5H14"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          active={editor.isActive("heading", { level: 3 })}
          title="Tiêu đề nhỏ (H3)"
        >
          <svg width="16" height="14" viewBox="0 0 16 14" fill="none">
            <path
              d="M2 2v10M2 7h6M8 2v10"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <path
              d="M11 7.5h2.5M11 7.5c0-1 .7-1.5 1.5-1.5s1.5.4 1.5 1s-.5 1-1.5 1s-1.5.4-1.5 1.2c0 .8.7 1.3 1.5 1.3H14"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </ToolbarBtn>
        <Divider />
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="In đậm"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M3 2h5a2.5 2.5 0 0 1 0 5H3V2z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M3 7h5.5a2.5 2.5 0 0 1 0 5H3V7z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="In nghiêng"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <line
              x1="9"
              y1="2"
              x2="5"
              y2="12"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <line
              x1="6"
              y1="2"
              x2="11"
              y2="2"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <line
              x1="3"
              y1="12"
              x2="8"
              y2="12"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          title="Gạch chân"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M3 2v5a4 4 0 0 0 8 0V2"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              fill="none"
            />
            <line
              x1="2"
              y1="13"
              x2="12"
              y2="13"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </ToolbarBtn>
        <Divider />
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Danh sách"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="2" cy="4" r="1" fill="currentColor" />
            <circle cx="2" cy="7" r="1" fill="currentColor" />
            <circle cx="2" cy="10" r="1" fill="currentColor" />
            <line
              x1="5"
              y1="4"
              x2="13"
              y2="4"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <line
              x1="5"
              y1="7"
              x2="13"
              y2="7"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <line
              x1="5"
              y1="10"
              x2="13"
              y2="10"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Danh sách số"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <text
              x="0"
              y="5"
              fontSize="5"
              fill="currentColor"
              fontFamily="sans-serif"
            >
              1.
            </text>
            <text
              x="0"
              y="9"
              fontSize="5"
              fill="currentColor"
              fontFamily="sans-serif"
            >
              2.
            </text>
            <text
              x="0"
              y="13"
              fontSize="5"
              fill="currentColor"
              fontFamily="sans-serif"
            >
              3.
            </text>
            <line
              x1="5"
              y1="4"
              x2="13"
              y2="4"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <line
              x1="5"
              y1="8"
              x2="13"
              y2="8"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <line
              x1="5"
              y1="12"
              x2="13"
              y2="12"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Trích dẫn"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M2 9c0-2.5 1.5-4.5 3-5.5L6 5c-1 .5-1.5 1.5-1.5 2.5H6V9H2zM8 9c0-2.5 1.5-4.5 3-5.5L12 5c-1 .5-1.5 1.5-1.5 2.5H12V9H8z"
              fill="currentColor"
              opacity="0.7"
            />
          </svg>
        </ToolbarBtn>
        <Divider />
        <ToolbarBtn
          onClick={openLinkDialog}
          active={editor.isActive("link")}
          title="Chèn liên kết"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M5.5 8.5a3.5 3.5 0 0 0 5 0l1.5-1.5a3.5 3.5 0 0 0-5-5L6 3"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M8.5 5.5a3.5 3.5 0 0 0-5 0L2 7a3.5 3.5 0 0 0 5 5l1-1"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </ToolbarBtn>
        {editor.isActive("link") && (
          <ToolbarBtn
            onClick={() => editor.chain().focus().unsetLink().run()}
            title="Xoá liên kết"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M5.5 8.5a3.5 3.5 0 0 0 5 0l1.5-1.5a3.5 3.5 0 0 0-5-5L6 3"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M8.5 5.5a3.5 3.5 0 0 0-5 0L2 7a3.5 3.5 0 0 0 5 5l1-1"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                fill="none"
              />
              <line
                x1="2"
                y1="2"
                x2="12"
                y2="12"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </ToolbarBtn>
        )}
        <ToolbarBtn
          onClick={() => setImageDialogOpen(true)}
          title="Chèn hình ảnh"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect
              x="1"
              y="2"
              width="12"
              height="10"
              rx="1.5"
              stroke="currentColor"
              strokeWidth="1.3"
              fill="none"
            />
            <circle
              cx="4.5"
              cy="5.5"
              r="1.5"
              stroke="currentColor"
              strokeWidth="1"
            />
            <path
              d="M1 10l3.5-3 2 2 3-3.5L13 10"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </ToolbarBtn>
        <Divider />
        <ToolbarBtn
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Đường kẻ ngang"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <line
              x1="2"
              y1="7"
              x2="12"
              y2="7"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeDasharray="2 1.5"
            />
          </svg>
        </ToolbarBtn>
        <div className="flex-1" />
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            autoFormat();
          }}
          title="Định dạng tự động"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-dashed border-emerald-500/40 text-emerald-700 hover:bg-emerald-50 transition shrink-0"
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path
              d="M2 3h6M2 7h8M2 11h5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <path
              d="M11 6l2 2-2 2"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Định dạng
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            const hasContent = editor.getText().trim().length > 0;
            if (
              hasContent &&
              !confirm(
                "Nội dung hiện tại sẽ bị thay thế bằng template. Tiếp tục?",
              )
            )
              return;
            editor.chain().focus().setContent(BLOG_TEMPLATE).run();
          }}
          title="Dùng template"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-dashed border-[#dc2626]/40 text-[#dc2626] hover:bg-red-50 transition shrink-0"
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <rect
              x="1"
              y="1"
              width="12"
              height="12"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.4"
              fill="none"
            />
            <line
              x1="4"
              y1="4"
              x2="10"
              y2="4"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
            <line
              x1="4"
              y1="7"
              x2="10"
              y2="7"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
            <line
              x1="4"
              y1="10"
              x2="7"
              y2="10"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
          Template
        </button>
      </div>

      <div className="bg-white">
        <EditorContent editor={editor} />
      </div>

      <div className="px-5 py-2 border-t border-gray-100 bg-gray-50/50 flex justify-end">
        <span className="text-[11px] text-gray-400">
          {editor.getText().trim().length > 0
            ? `${editor.getText().trim().split(/\s+/).length} từ`
            : "Chưa có nội dung"}
        </span>
      </div>

      {/* Link dialog */}
      {linkDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              Chèn liên kết
            </h3>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") applyLink();
                if (e.key === "Escape") setLinkDialogOpen(false);
              }}
              placeholder="https://..."
              autoFocus
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-300 focus:ring-2 focus:ring-red-50 transition mb-4"
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setLinkDialogOpen(false)}
                className="px-4 py-2 rounded-xl text-sm text-gray-500 bg-gray-100 hover:bg-gray-200 transition"
              >
                Huỷ
              </button>
              <button
                type="button"
                onClick={applyLink}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition hover:opacity-90"
                style={{ background: "#4a2318" }}
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image dialog */}
      {imageDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              Chèn hình ảnh
            </h3>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") applyImage();
                if (e.key === "Escape") setImageDialogOpen(false);
              }}
              placeholder="https://... (đường dẫn ảnh)"
              autoFocus
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-300 focus:ring-2 focus:ring-red-50 transition mb-4"
            />
            {imageUrl.trim() && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl.trim()}
                alt="preview"
                className="w-full h-32 object-cover rounded-xl mb-4 border border-gray-100"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            )}
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => {
                  setImageDialogOpen(false);
                  setImageUrl("");
                }}
                className="px-4 py-2 rounded-xl text-sm text-gray-500 bg-gray-100 hover:bg-gray-200 transition"
              >
                Huỷ
              </button>
              <button
                type="button"
                onClick={applyImage}
                disabled={!imageUrl.trim()}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-40"
                style={{ background: "#4a2318" }}
              >
                Chèn ảnh
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
