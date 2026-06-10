const MENTION_REGEX = /@[\w가-힣]{1,20}/g;
const URL_REGEX = /https?:\/\/[^\s<]+[^\s<.,;:!?"'\])}>]/g;
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

const TOKEN_REGEX = new RegExp(
  `${MENTION_REGEX.source}|${URL_REGEX.source}|${EMAIL_REGEX.source}`,
  "g",
);

type TextSegment =
  | { kind: "text"; value: string }
  | { kind: "mention"; value: string }
  | { kind: "link"; href: string; label: string };

function parseTextSegments(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(TOKEN_REGEX)) {
    const value = match[0];
    const index = match.index ?? 0;

    if (index > lastIndex) {
      segments.push({ kind: "text", value: text.slice(lastIndex, index) });
    }

    if (value.startsWith("@")) {
      segments.push({ kind: "mention", value });
    } else if (value.startsWith("http://") || value.startsWith("https://")) {
      segments.push({ kind: "link", href: value, label: value });
    } else {
      segments.push({ kind: "link", href: `mailto:${value}`, label: value });
    }

    lastIndex = index + value.length;
  }

  if (lastIndex < text.length) {
    segments.push({ kind: "text", value: text.slice(lastIndex) });
  }

  return segments;
}

const LINK_CLASS_NAME = "text-primary underline underline-offset-2";

export function MentionText({ text, className }: { text: string; className?: string }) {
  const segments = parseTextSegments(text);

  return (
    <span className={className}>
      {segments.map((segment, index) => {
        if (segment.kind === "mention") {
          return (
            <span key={index} className="font-medium text-community-green">
              {segment.value}
            </span>
          );
        }

        if (segment.kind === "link") {
          return (
            <a
              key={index}
              href={segment.href}
              target="_blank"
              rel="noopener noreferrer"
              className={LINK_CLASS_NAME}
            >
              {segment.label}
            </a>
          );
        }

        return <span key={index}>{segment.value}</span>;
      })}
    </span>
  );
}
