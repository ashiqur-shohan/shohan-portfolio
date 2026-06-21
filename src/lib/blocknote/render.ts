import "server-only";

import { ServerBlockNoteEditor } from "@blocknote/server-util";
import type { PartialBlock } from "@blocknote/core";
import hljs from "highlight.js";

/**
 * Renders BlockNote blocks to the static HTML stored as `Post.content_html` and
 * served on the public reading page. Runs once at SAVE time, server-side, in the
 * Node.js runtime (CLAUDE.md hard rule #3) — the public page never loads the
 * editor.
 *
 * Two steps:
 *  1. `ServerBlockNoteEditor.blocksToFullHTML` — the default schema emits clean
 *     markup (no language-picker chrome that the editor schema would add).
 *  2. Code blocks are syntax-highlighted with highlight.js, which emits
 *     class-based spans (`hljs-*`) — no inline colors — so the theme stays driven
 *     by the tokens in globals.css. (`blocksToFullHTML` never bakes in the
 *     editor's live Shiki highlighting, so this pass is required.)
 */
export async function renderPostHtml(blocks: unknown): Promise<string> {
  const editor = ServerBlockNoteEditor.create();
  const html = await editor.blocksToFullHTML(blocks as PartialBlock[]);
  return highlightCodeBlocks(html);
}

/** BlockNote (Shiki) language ids that differ from highlight.js ids. */
const LANGUAGE_ALIASES: Record<string, string> = {
  shellscript: "bash",
  "objective-c": "objectivec",
  "vue-html": "xml",
  html: "xml",
  vue: "xml",
  svelte: "xml",
  postcss: "css",
  jsonc: "json",
  jsonl: "json",
};

/** Reverse the entity escaping `blocksToFullHTML` applies to code text. */
function unescapeHtml(input: string): string {
  return input
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

// Matches the predictable, machine-generated code-block fragment that
// blocksToFullHTML emits with the default schema. The output is fully under our
// control (see lib/blocknote probes), so a targeted regex is safe here.
const CODE_BLOCK_RE =
  /(<div class="bn-block-content" data-content-type="codeBlock"(?: data-language="([^"]*)")?>)<pre><code class="bn-inline-content">([\s\S]*?)<\/code><\/pre>/g;

function highlightCodeBlocks(html: string): string {
  return html.replace(CODE_BLOCK_RE, (_match, openingDiv, language, codeEsc) => {
    const mapped = language ? (LANGUAGE_ALIASES[language] ?? language) : null;
    const valid = mapped && hljs.getLanguage(mapped) ? mapped : null;

    // `codeEsc` is already HTML-escaped; highlight.js re-escapes its own output,
    // so unescape only when we actually run the highlighter.
    const inner = valid
      ? hljs.highlight(unescapeHtml(codeEsc), {
          language: valid,
          ignoreIllegals: true,
        }).value
      : codeEsc;

    const className = valid ? `hljs language-${valid}` : "hljs";
    return `${openingDiv}<pre><code class="${className}">${inner}</code></pre>`;
  });
}
