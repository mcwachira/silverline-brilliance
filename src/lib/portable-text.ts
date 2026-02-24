// ─── Portable Text Types ─────────────────────────────────────────────────────

export interface PTSpan {
  _type: "span";
  _key: string;
  text: string;
  marks: string[];
}

export interface PTMarkDef {
  _key: string;
  _type: string;
  href?: string;
}

export interface PTBlock {
  _type: "block";
  _key: string;
  style: "normal" | "h1" | "h2" | "h3" | "h4" | "blockquote";
  children: PTSpan[];
  markDefs: PTMarkDef[];
  listItem?: "bullet" | "number";
  level?: number;
}

export interface PTImageBlock {
  _type: "image";
  _key: string;
  asset: {
    _type: "reference";
    _ref: string;
  };
  alt?: string;
}

export type PortableTextBlock = PTBlock | PTImageBlock;

// ─── Tiptap JSON Types ────────────────────────────────────────────────────────

export interface TiptapMark {
  type: string;
  attrs?: Record<string, unknown>;
}

export interface TiptapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  text?: string;
  marks?: TiptapMark[];
}

export interface TiptapDoc {
  type: "doc";
  content: TiptapNode[];
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function genKey(): string {
  return Math.random().toString(36).slice(2, 10);
}

// ─── Tiptap → Portable Text ───────────────────────────────────────────────────

function spansFromContent(
  content: TiptapNode[],
  markDefs: PTMarkDef[]
): PTSpan[] {
  const spans: PTSpan[] = [];

  for (const node of content) {
    if (node.type === "hardBreak") {
      spans.push({ _type: "span", _key: genKey(), text: "\n", marks: [] });
      continue;
    }

    if (node.type !== "text") continue;

    const marks: string[] = [];

    for (const mark of node.marks ?? []) {
      switch (mark.type) {
        case "bold":
          marks.push("strong");
          break;
        case "italic":
          marks.push("em");
          break;
        case "underline":
          marks.push("underline");
          break;
        case "code":
          marks.push("code");
          break;
        case "link": {
          const key = genKey();
          marks.push(key);
          markDefs.push({
            _key: key,
            _type: "link",
            href: String(mark.attrs?.href ?? ""),
          });
          break;
        }
      }
    }

    spans.push({
      _type: "span",
      _key: genKey(),
      text: node.text ?? "",
      marks,
    });
  }

  if (spans.length === 0) {
    spans.push({ _type: "span", _key: genKey(), text: "", marks: [] });
  }

  return spans;
}

function buildBlock(
  content: TiptapNode[] | undefined,
  overrides: Partial<Omit<PTBlock, "_type" | "_key" | "children" | "markDefs">>
): PTBlock {
  const markDefs: PTMarkDef[] = [];
  const children = spansFromContent(content ?? [], markDefs);
  return {
    _type: "block",
    _key: genKey(),
    style: "normal",
    markDefs,
    children,
    ...overrides,
  };
}

function listItemBlocks(
  item: TiptapNode,
  listItem: "bullet" | "number",
  level = 1
): PTBlock[] {
  const blocks: PTBlock[] = [];
  for (const child of item.content ?? []) {
    if (child.type === "paragraph") {
      blocks.push(buildBlock(child.content, { listItem, level }));
    } else if (child.type === "bulletList") {
      for (const sub of child.content ?? [])
        blocks.push(...listItemBlocks(sub, "bullet", level + 1));
    } else if (child.type === "orderedList") {
      for (const sub of child.content ?? [])
        blocks.push(...listItemBlocks(sub, "number", level + 1));
    }
  }
  return blocks;
}

export function tiptapToPortableText(doc: TiptapDoc): PortableTextBlock[] {
  const blocks: PortableTextBlock[] = [];

  for (const node of doc.content ?? []) {
    switch (node.type) {
      case "paragraph":
        blocks.push(buildBlock(node.content, { style: "normal" }));
        break;

      case "heading": {
        const lvl = Math.min(Math.max(Number(node.attrs?.level ?? 1), 1), 4);
        blocks.push(
          buildBlock(node.content, {
            style: `h${lvl}` as PTBlock["style"],
          })
        );
        break;
      }

      case "bulletList":
        for (const item of node.content ?? [])
          blocks.push(...listItemBlocks(item, "bullet"));
        break;

      case "orderedList":
        for (const item of node.content ?? [])
          blocks.push(...listItemBlocks(item, "number"));
        break;

      case "blockquote":
        for (const inner of node.content ?? []) {
          if (inner.type === "paragraph") {
            blocks.push(buildBlock(inner.content, { style: "blockquote" }));
          }
        }
        break;

      case "codeBlock": {
        const text =
          node.content?.map((n) => n.text ?? "").join("") ?? "";
        blocks.push({
          _type: "block",
          _key: genKey(),
          style: "normal",
          markDefs: [],
          children: [
            { _type: "span", _key: genKey(), text, marks: ["code"] },
          ],
        });
        break;
      }

      case "sanityImage":
        if (node.attrs?.assetRef) {
          blocks.push({
            _type: "image",
            _key: genKey(),
            asset: {
              _type: "reference",
              _ref: String(node.attrs.assetRef),
            },
            alt: String(node.attrs.alt ?? ""),
          });
        }
        break;
    }
  }

  return blocks;
}

// ─── Portable Text → Tiptap ───────────────────────────────────────────────────

function marksToTiptap(
  ptMarks: string[],
  markDefs: PTMarkDef[]
): TiptapMark[] {
  return ptMarks.flatMap((mark) => {
    switch (mark) {
      case "strong":
        return [{ type: "bold" }];
      case "em":
        return [{ type: "italic" }];
      case "underline":
        return [{ type: "underline" }];
      case "code":
        return [{ type: "code" }];
      default: {
        const def = markDefs.find((d) => d._key === mark);
        if (def?._type === "link") {
          return [{ type: "link", attrs: { href: def.href ?? "" } }];
        }
        return [];
      }
    }
  });
}

function spansToTiptap(
  children: PTSpan[],
  markDefs: PTMarkDef[]
): TiptapNode[] {
  return children.map((span) => ({
    type: "text",
    text: span.text,
    ...(span.marks.length > 0
      ? { marks: marksToTiptap(span.marks, markDefs) }
      : {}),
  }));
}

export function portableTextToTiptap(blocks: PortableTextBlock[]): TiptapDoc {
  const content: TiptapNode[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];

    // Image
    if (block._type === "image") {
      content.push({
        type: "sanityImage",
        attrs: {
          assetRef: block.asset._ref,
          alt: block.alt ?? "",
          url: null,
        },
      });
      i++;
      continue;
    }

    if (block._type !== "block") {
      i++;
      continue;
    }

    const pt = block as PTBlock;

    // List items — group consecutive same-type into one list node
    if (pt.listItem) {
      const listType = pt.listItem;
      const tiptapType =
        listType === "bullet" ? "bulletList" : "orderedList";
      const items: TiptapNode[] = [];

      while (
        i < blocks.length &&
        blocks[i]._type === "block" &&
        (blocks[i] as PTBlock).listItem === listType
      ) {
        const lb = blocks[i] as PTBlock;
        items.push({
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: spansToTiptap(lb.children, lb.markDefs),
            },
          ],
        });
        i++;
      }

      content.push({ type: tiptapType, content: items });
      continue;
    }

    // Regular blocks
    switch (pt.style) {
      case "h1":
      case "h2":
      case "h3":
      case "h4":
        content.push({
          type: "heading",
          attrs: { level: parseInt(pt.style[1]) },
          content: spansToTiptap(pt.children, pt.markDefs),
        });
        break;

      case "blockquote":
        content.push({
          type: "blockquote",
          content: [
            {
              type: "paragraph",
              content: spansToTiptap(pt.children, pt.markDefs),
            },
          ],
        });
        break;

      default: {
        // Detect code block: single span with only code mark
        const isCode =
          pt.children.length === 1 &&
          pt.children[0].marks.length === 1 &&
          pt.children[0].marks[0] === "code";

        if (isCode) {
          content.push({
            type: "codeBlock",
            attrs: {},
            content: [{ type: "text", text: pt.children[0].text }],
          });
        } else {
          content.push({
            type: "paragraph",
            content: spansToTiptap(pt.children, pt.markDefs),
          });
        }
        break;
      }
    }

    i++;
  }

  if (content.length === 0) {
    content.push({ type: "paragraph" });
  }

  return { type: "doc", content };
}

// ─── Type guards ──────────────────────────────────────────────────────────────

export function isPTBlock(block: PortableTextBlock): block is PTBlock {
  return block._type === "block";
}

export function isPTImageBlock(
  block: PortableTextBlock
): block is PTImageBlock {
  return block._type === "image";
}