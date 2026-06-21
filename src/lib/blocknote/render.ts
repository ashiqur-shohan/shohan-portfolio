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
 * Pipeline:
 *  1. `ServerBlockNoteEditor.blocksToFullHTML` — the default schema emits clean
 *     markup (no language-picker chrome that the editor schema would add).
 *  2. Syntax-highlight code blocks with highlight.js (class-based `hljs-*` spans,
 *     no inline colors → themed by the tokens in globals.css). `blocksToFullHTML`
 *     never bakes in the editor's live highlighting, so this pass is required. The
 *     code `<pre>` is made keyboard-focusable so overflowing code can be scrolled.
 *  3. Demote in-body headings by one level so the page's `<h1>` (the post title)
 *     stays unique and the document outline is well-formed.
 *  4. Neutralize any non-http(s)/mailto URL in href/src as defense-in-depth
 *     (content is admin-authored, but it is injected via dangerouslySetInnerHTML).
 */
export async function renderPostHtml(blocks: unknown): Promise<string> {
  const editor = ServerBlockNoteEditor.create();
  const html = await editor.blocksToFullHTML(blocks as PartialBlock[]);
  return sanitizeUrls(demoteHeadings(highlightCodeBlocks(html)));
}

/* ----------------------------- code highlight ---------------------------- */

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
    // tabindex makes the horizontally-scrollable block reachable by keyboard.
    return `${openingDiv}<pre tabindex="0"><code class="${className}">${inner}</code></pre>`;
  });
}

/* ------------------------------- headings -------------------------------- */

/**
 * Shift every in-body heading down one level (h1→h2 … h5→h6) in a single pass.
 * The reading page already renders the post title as the page `<h1>`; without
 * this, an author-inserted "Heading 1" would create a second `<h1>` and an
 * inverted outline. Inline text is entity-escaped by blocksToFullHTML, so only
 * real heading tags match.
 */
function demoteHeadings(html: string): string {
  return html.replace(
    /<(\/?)h([1-5])\b/g,
    (_match, slash: string, level: string) => `<${slash}h${Number(level) + 1}`,
  );
}

/* --------------------------------- urls ---------------------------------- */

/** Allow relative/anchor URLs and the http(s)/mailto schemes; reject the rest. */
function isSafeUrl(url: string, allowMailto: boolean): boolean {
  const value = url.trim().toLowerCase();
  if (!/^[a-z][a-z0-9+.-]*:/.test(value)) return true; // no scheme → relative
  if (value.startsWith("http:") || value.startsWith("https:")) return true;
  return allowMailto && value.startsWith("mailto:");
}

function sanitizeUrls(html: string): string {
  return html
    .replace(/\shref="([^"]*)"/g, (match, url) =>
      isSafeUrl(url, true) ? match : ' href="#"',
    )
    .replace(/\ssrc="([^"]*)"/g, (match, url) =>
      isSafeUrl(url, false) ? match : ' src=""',
    );
}
