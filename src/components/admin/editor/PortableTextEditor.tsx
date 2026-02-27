"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import UnderlineExt from "@tiptap/extension-underline";
import LinkExt from "@tiptap/extension-link";
import PlaceholderExt from "@tiptap/extension-placeholder";
import CharacterCountExt from "@tiptap/extension-character-count";
import { Node, mergeAttributes } from "@tiptap/core";
import { useEffect, forwardRef, useImperativeHandle } from "react";
import {
  tiptapToPortableText,
  portableTextToTiptap,
} from "@/src/lib/portable-text";
import type { PortableTextBlock, TiptapDoc } from "@/src/lib/portable-text";
import EditorToolbar from "./EditorToolbar";

// ─── Custom Sanity Image Node ─────────────────────────────────────────────────

const SanityImageNode = Node.create({
  name: "sanityImage",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      assetRef: { default: null },
      alt: { default: "" },
      url: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-sanity-image]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-sanity-image": "" }),
    ];
  },

  addNodeView() {
    return ({ node, getPos, editor: ed }) => {
      const wrapper = document.createElement("div");
      wrapper.className = "sanity-image-wrapper";
      wrapper.setAttribute("data-sanity-image", "");

      const img = document.createElement("img");
      img.src = node.attrs.url ?? "";
      img.alt = node.attrs.alt ?? "";
      img.className = "sanity-image-img";

      // Alt text input overlay
      const altWrapper = document.createElement("div");
      altWrapper.className = "sanity-image-alt-wrapper";

      const altInput = document.createElement("input");
      altInput.type = "text";
      altInput.value = node.attrs.alt ?? "";
      altInput.placeholder = "Alt text (for accessibility)...";
      altInput.className = "sanity-image-alt-input";
      altInput.addEventListener("change", (e) => {
        if (typeof getPos === "function") {
          const pos = getPos();
          if (pos !== undefined) {
            ed
              .chain()
              .setNodeSelection(pos)
              .command(({ tr }) => {
                tr.setNodeMarkup(pos, undefined, {
                  ...node.attrs,
                  alt: (e.target as HTMLInputElement).value,
                });
                return true;
              })
              .run();
          }
        }
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.innerHTML = "×";
      deleteBtn.className = "sanity-image-delete";
      deleteBtn.title = "Remove image";
      deleteBtn.addEventListener("mousedown", (e) => {
        e.preventDefault();
        if (typeof getPos === "function") {
          const pos = getPos();
          if (pos !== undefined) {
            ed
              .chain()
              .focus()
              .deleteRange({ from: pos, to: pos + node.nodeSize })
              .run();
          }
        }
      });

      altWrapper.appendChild(altInput);
      wrapper.appendChild(img);
      wrapper.appendChild(altWrapper);
      wrapper.appendChild(deleteBtn);

      return {
        dom: wrapper,
        update: (updatedNode) => {
          if (updatedNode.type.name !== "sanityImage") return false;
          img.src = updatedNode.attrs.url ?? "";
          altInput.value = updatedNode.attrs.alt ?? "";
          return true;
        },
      };
    };
  },
});

// ─── Editor handle (for imperative focus) ─────────────────────────────────────

export interface PortableTextEditorHandle {
  getEditor: () => Editor | null;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  value: PortableTextBlock[];
  onChange: (value: PortableTextBlock[]) => void;
  placeholder?: string;
  disabled?: boolean;
  minHeight?: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

const PortableTextEditor = forwardRef<PortableTextEditorHandle, Props>(
  function PortableTextEditor(
    {
      value,
      onChange,
      placeholder = "Start writing your post...",
      disabled = false,
      minHeight = 400,
    },
    ref
  ) {
    const initialContent = portableTextToTiptap(value ?? []);

    const editor = useEditor({
         immediatelyRender: false,  
      extensions: [
        StarterKit.configure({
          codeBlock: {
            HTMLAttributes: { class: "editor-code-block" },
          },
          blockquote: {
            HTMLAttributes: { class: "editor-blockquote" },
          },
        }),
        UnderlineExt,
        LinkExt.configure({
          openOnClick: false,
          HTMLAttributes: { class: "editor-link", rel: "noopener noreferrer" },
        }),
        PlaceholderExt.configure({ placeholder }),
        CharacterCountExt,
        SanityImageNode,
      ],
      content: initialContent,
      editable: !disabled,
      editorProps: {
        attributes: {
          class: "portable-text-editor-body",
          spellcheck: "true",
        },
      },
      onUpdate({ editor: e }) {
        const doc = e.getJSON() as TiptapDoc;
        onChange(tiptapToPortableText(doc));
      },
    });

    useImperativeHandle(ref, () => ({
      getEditor: () => editor,
    }));

    // Sync when value changes externally (e.g., loading existing post)
    useEffect(() => {
      if (!editor || editor.isDestroyed) return;
      // Only sync on mount — don't fight with user input
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const wordCount = editor?.storage.characterCount?.words() ?? 0;
    const charCount = editor?.storage.characterCount?.characters() ?? 0;

    return (
      <div
        className="portable-text-editor-root"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "0.75rem",
          overflow: "hidden",
          transition: "border-color 0.15s ease",
        }}
        onFocus={(e) => {
          const root = e.currentTarget as HTMLElement;
          root.style.borderColor = "var(--accent)";
          root.style.boxShadow = "0 0 0 3px oklch(0.88 0.17 85 / 0.1)";
        }}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            const root = e.currentTarget as HTMLElement;
            root.style.borderColor = "var(--border)";
            root.style.boxShadow = "none";
          }
        }}
      >
        {/* Toolbar */}
        <EditorToolbar editor={editor} />

        {/* Editor body */}
        <div style={{ minHeight, position: "relative" }}>
          <EditorContent editor={editor} />
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-4 py-2 border-t text-xs"
          style={{
            borderColor: "var(--border)",
            color: "var(--text-faint)",
            background: "oklch(0.22 0.07 285 / 0.5)",
          }}
        >
          <span>
            {wordCount.toLocaleString()} word
            {wordCount !== 1 ? "s" : ""}
          </span>
          <span>{charCount.toLocaleString()} characters</span>
        </div>
      </div>
    );
  }
);

export default PortableTextEditor;