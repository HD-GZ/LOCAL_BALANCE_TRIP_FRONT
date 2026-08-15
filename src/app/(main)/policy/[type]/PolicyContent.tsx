type ContentBlock =
  | { kind: "heading"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "paragraph"; text: string };

/**
 * 약관 전문은 "## 제목" · "- 항목" 표기만 쓰는 제한된 마크다운 형식으로 내려온다
 * (Terms API 스펙). 이 범위만 다루면 되므로 별도 마크다운 라이브러리 없이 파싱한다.
 */
function parsePolicyContent(content: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  let listBuffer: string[] = [];

  const flushList = () => {
    if (listBuffer.length > 0) {
      blocks.push({ kind: "list", items: listBuffer });
      listBuffer = [];
    }
  };

  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();

    if (line.length === 0) {
      flushList();
      continue;
    }

    if (line.startsWith("## ")) {
      flushList();
      blocks.push({ kind: "heading", text: line.slice(3) });
      continue;
    }

    if (line.startsWith("- ")) {
      listBuffer.push(line.slice(2));
      continue;
    }

    flushList();
    blocks.push({ kind: "paragraph", text: line });
  }

  flushList();
  return blocks;
}

export default function PolicyContent({ content }: { content: string }) {
  const blocks = parsePolicyContent(content);

  return (
    <div className="flex flex-col gap-4">
      {blocks.map((block, index) => {
        if (block.kind === "heading") {
          return (
            <h2 key={index} className="text-title-3 text-ink mt-2 first:mt-0">
              {block.text}
            </h2>
          );
        }

        if (block.kind === "list") {
          return (
            <ul key={index} className="text-body-sm text-ink-2 flex flex-col gap-1.5 pl-5">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className="list-disc">
                  {item}
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={index} className="text-body-sm text-ink-2">
            {block.text}
          </p>
        );
      })}
    </div>
  );
}
