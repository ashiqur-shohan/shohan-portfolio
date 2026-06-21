import { BlockNoteSchema, createCodeBlockSpec } from "@blocknote/core";
import { codeBlockOptions } from "@blocknote/code-block";

/**
 * The BlockNote schema for the blog editor. Extends the default schema with the
 * code-block spec from `@blocknote/code-block`, which enables Shiki syntax
 * highlighting *inside the editor* (a live decoration).
 *
 * Isomorphic on purpose: no React, no "server-only". Today only the client
 * editor imports it; the server HTML renderer (lib/blocknote/render.ts) uses the
 * default schema, since `codeBlock` is identical in both and the default schema
 * emits clean static markup (no language-picker chrome).
 */
export const postEditorSchema = BlockNoteSchema.create().extend({
  blockSpecs: {
    codeBlock: createCodeBlockSpec(codeBlockOptions),
  },
});
