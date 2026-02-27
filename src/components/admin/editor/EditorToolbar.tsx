"use client";

import type { Editor } from "@tiptap/react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { uploadImageToSanity } from "@/src/app/actions/blog-editor";
import LinkDialog from "./LinkDialog";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Code2,
  Link2,
  Image,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Loader2,
  Minus,
} from "lucide-react";

interface Props {
  editor: Editor | null;
  onImageInserted?: (assetRef: string, url: string) => void;
}

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}

function ToolbarButton({
  onClick,
  active = false,
  disabled = false,
  title,
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault(); // Prevent editor blur
        if (!disabled) onClick();
      }}
      title={title}
      disabled={disabled}
      className="relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-100 flex-shrink-0"
      style={{
        background: active
          ? "oklch(0.49 0.18 302 / 0.25)"
          : "transparent",
        color: active
          ? "var(--accent)"
          : disabled
          ? "var(--text-faint)"
          : "var(--text-muted)",
        border: active
          ? "1px solid oklch(0.49 0.18 302 / 0.3)"
          : "1px solid transparent",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
      }}
    >
      {children}
    </button>
  );
}

function Divider() {
  return (
    <div
      className="w-px h-5 flex-shrink-0 mx-0.5"
      style={{ background: "var(--border)" }}
    />
  );
}

export default function EditorToolbar({ editor, onImageInserted }: Props) {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkDialogPos, setLinkDialogPos] = useState({ top: 0, left: 0 });
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const linkButtonRef = useRef<HTMLButtonElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  if (!editor) return null;

  const currentHref = editor.getAttributes("link").href ?? "";

  function openLinkDialog() {
    if (!linkButtonRef.current || !toolbarRef.current) return;
    const btnRect = linkButtonRef.current.getBoundingClientRect();
    const tbRect = toolbarRef.current.getBoundingClientRect();
    setLinkDialogPos({
      top: btnRect.bottom - tbRect.top + 8,
      left: Math.min(
        btnRect.left - tbRect.left,
        tbRect.width - 320 - 8
      ),
    });
    setLinkDialogOpen(true);
  }

  function handleSetLink(href: string) {
    editor!.chain().focus().extendMarkRange("link").setLink({ href }).run();
    setLinkDialogOpen(false);
  }

  function handleRemoveLink() {
    editor!.chain().focus().extendMarkRange("link").unsetLink().run();
    setLinkDialogOpen(false);
  }

  async function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadImageToSanity(formData);

      if (!result.success || !result.data) {
        toast.error(result.error ?? "Image upload failed");
        return;
      }

      const { assetRef, url } = result.data;

      if (editor) {
        editor
          .chain()
          .focus()
          .insertContent({
            type: "sanityImage",
            attrs: { assetRef, url, alt: file.name.replace(/\.[^.]+$/, "") },
          })
          .run();
      }

      onImageInserted?.(assetRef, url);
      toast.success("Image inserted");
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div
      ref={toolbarRef}
      className="relative"
      style={{
        borderBottom: "1px solid var(--border)",
        background: "oklch(0.22 0.07 285)",
      }}
    >
      <div className="flex items-center flex-wrap gap-0.5 px-3 py-2">
        {/* History */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo (Ctrl+Z)"
        >
          <Undo className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo (Ctrl+Y)"
        >
          <Redo className="w-3.5 h-3.5" />
        </ToolbarButton>

        <Divider />

        {/* Headings */}
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          active={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          active={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          active={editor.isActive("heading", { level: 4 })}
          title="Heading 4"
        >
          <Heading4 className="w-3.5 h-3.5" />
        </ToolbarButton>

        <Divider />

        {/* Inline marks */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          title="Underline (Ctrl+U)"
        >
          <Underline className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")}
          title="Inline Code"
        >
          <Code className="w-3.5 h-3.5" />
        </ToolbarButton>

        <Divider />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Numbered List"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </ToolbarButton>

        <Divider />

        {/* Block formats */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Blockquote"
        >
          <Quote className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
          title="Code Block"
        >
          <Code2 className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().setHorizontalRule().run()
          }
          title="Horizontal Rule"
        >
          <Minus className="w-3.5 h-3.5" />
        </ToolbarButton>

        <Divider />

        {/* Link */}
        <button
          ref={linkButtonRef}
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            openLinkDialog();
          }}
          title="Link (Ctrl+K)"
          className="relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-100 flex-shrink-0"
          style={{
            background: editor.isActive("link")
              ? "oklch(0.49 0.18 302 / 0.25)"
              : "transparent",
            color: editor.isActive("link")
              ? "var(--accent)"
              : "var(--text-muted)",
            border: editor.isActive("link")
              ? "1px solid oklch(0.49 0.18 302 / 0.3)"
              : "1px solid transparent",
          }}
        >
          <Link2 className="w-3.5 h-3.5" />
        </button>

        {/* Image Upload */}
        <ToolbarButton
          onClick={() => fileInputRef.current?.click()}
          title="Insert Image"
          disabled={uploadingImage}
        >
          {uploadingImage ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Image className="w-3.5 h-3.5" />
          )}
        </ToolbarButton>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>

      {/* Link dialog — positioned relative to toolbar */}
      <div
        style={{
          position: "absolute",
          top: `${linkDialogPos.top}px`,
          left: `${linkDialogPos.left}px`,
        }}
      >
        <LinkDialog
          isOpen={linkDialogOpen}
          currentHref={currentHref}
          onConfirm={handleSetLink}
          onRemove={handleRemoveLink}
          onClose={() => setLinkDialogOpen(false)}
        />
      </div>
    </div>
  );
}