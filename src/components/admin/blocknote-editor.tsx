"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

import * as React from "react";
import { useTheme } from "next-themes";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import type { PartialBlock } from "@blocknote/core";

import { postEditorSchema } from "@/lib/blocknote/schema";

type EditorBlock = PartialBlock<
  typeof postEditorSchema.blockSchema,
  typeof postEditorSchema.inlineContentSchema,
  typeof postEditorSchema.styleSchema
>;

/**
 * Client-only BlockNote editor for the blog admin. Dynamically imported with
 * `{ ssr: false }` from the post form (CLAUDE.md hard rule #3) — it never runs
 * on the server and never ships to the public site. `onChange` lifts the current
 * block document to the parent, which serializes it on save.
 */
export function BlocknoteEditor({
  initialContent,
  onChange,
}: {
  initialContent?: unknown;
  onChange: (blocks: unknown[]) => void;
}) {
  const { resolvedTheme } = useTheme();

  const editor = useCreateBlockNote({
    schema: postEditorSchema,
    initialContent:
      Array.isArray(initialContent) && initialContent.length > 0
        ? (initialContent as EditorBlock[])
        : undefined,
    // Give the contenteditable region an accessible name (the visible "Content"
    // label in the form can't be associated with it via htmlFor).
    domAttributes: { editor: { "aria-label": "Post content" } },
  });

  // Seed the parent with the initial document so a save with no edits still
  // captures content; subsequent edits sync via onChange below.
  React.useEffect(() => {
    onChange(editor.document);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BlockNoteView
      editor={editor}
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      onChange={() => onChange(editor.document)}
    />
  );
}
