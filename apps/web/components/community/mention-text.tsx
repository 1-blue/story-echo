const MENTION_REGEX = /(@[\w가-힣]{1,20})/g;

export function MentionText({ text }: { text: string }) {
  const parts = text.split(MENTION_REGEX);

  return (
    <>
      {parts.map((part, index) =>
        part.startsWith("@") ? (
          <span key={index} className="text-community-green font-medium">
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  );
}
