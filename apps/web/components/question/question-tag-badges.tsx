import type { QuestionTagKey } from "@/lib/question-tags";
import { QUESTION_TAG_LABELS } from "@/lib/question-tags";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type QuestionTagBadgesProps = {
  tags: QuestionTagKey[];
  max?: number;
  className?: string;
};

function tagVariant(tag: QuestionTagKey): "echo" | "secondary" {
  return tag === "echo" || tag === "timecapsule" ? "echo" : "secondary";
}

export function QuestionTagBadges({ tags, max = 3, className }: QuestionTagBadgesProps) {
  const visible = tags.slice(0, max);

  if (visible.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-1", className)}>
      {visible.map((tag) => (
        <Badge key={tag} variant={tagVariant(tag)} className="px-2 py-0 text-[10px]">
          {QUESTION_TAG_LABELS[tag]}
        </Badge>
      ))}
    </div>
  );
}
