import type { Token, Tokens } from "./vendor/marked";
import { lexBlock } from "./components/markdown/lex";
import { normalizeNativeBlockLanguages } from "../shared/preferences-settings";

/** Leave matching fences whole so the host or another plugin can render them. */
export function assistantNeedsNativeBlocks(text: string, configured: string): boolean {
  const languages = normalizeNativeBlockLanguages(configured).split(",").filter(Boolean);
  if (!languages.length) return false;
  const contains = (tokens: readonly Token[]): boolean => tokens.some((token) => {
    if (token.type === "code") {
      const code = token as Tokens.Code;
      const language = (code.lang ?? "").trim().split(/\s+/)[0]?.toLowerCase() ?? "";
      return code.codeBlockStyle !== "indented" && languages.includes(language);
    }
    if (token.type === "list") return (token as Tokens.List).items.some((item) => contains(item.tokens));
    return contains((token as Tokens.Generic).tokens ?? []);
  });
  return contains(lexBlock(text, true));
}
