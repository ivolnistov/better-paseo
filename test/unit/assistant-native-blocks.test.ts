import { describe, expect, it } from "vitest";
import { assistantNeedsNativeBlocks } from "../../client/assistant-native-blocks";

describe("native fenced block routing", () => {
  it.each([
    "```mermaid\ngraph TD; A-->B\n```",
    "~~~DRAWIO extra-info\n<mxfile/>\n~~~",
    "> ```Mermaid\n> graph TD\n> ```",
    "- item\n\n  ~~~drawio\n  <mxfile/>\n  ~~~",
    "[Reference][x]\n\n```mermaid\ngraph TD",
    "```DRAWIO",
  ])("recognizes actual nested, complete and streaming fences: %s", (text) => {
    expect(assistantNeedsNativeBlocks(text, " MERMAID, drawio ")).toBe(true);
  });
  it.each([
    "`mermaid` and text saying ```drawio",
    "```mermaid-js\ngraph TD\n```",
    "```typescript\nconst x = 1\n```",
    "````markdown\n```mermaid\ngraph TD\n```\n````",
    "    ```mermaid\n    graph TD\n    ```",
    "<pre>\n```mermaid\n</pre>",
  ])("ignores nonmatching blocks and fence markers inside samples: %s", (text) => {
    expect(assistantNeedsNativeBlocks(text, "mermaid,drawio")).toBe(false);
  });
  it("supports custom exact names and an empty opt-out", () => {
    expect(assistantNeedsNativeBlocks("~~~PYTHON title\npass", "python")).toBe(true);
    expect(assistantNeedsNativeBlocks("```mermaid\ngraph TD", " , ")).toBe(false);
    expect(assistantNeedsNativeBlocks("```mermaid\ngraph TD", "mer.*")).toBe(false);
  });
});
