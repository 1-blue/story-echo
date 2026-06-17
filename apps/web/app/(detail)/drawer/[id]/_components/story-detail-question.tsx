import type { QuestionTagKey } from "@/lib/question-tags";
import { QuestionTagBadges } from "@/components/question/question-tag-badges";
import { cn } from "@/lib/utils";
import { QUESTION_SIZE_CLASSES, type FontSizePreference } from "../_hooks/use-font-size";

type StoryDetailQuestionProps = {
  questionText: string | null;
  questionTags: QuestionTagKey[];
  fontSize: FontSizePreference;
};

export function StoryDetailQuestion({
  questionText,
  questionTags,
  fontSize,
}: StoryDetailQuestionProps) {
  return (
    <div className="mb-8">
      <h2
        className={cn(
          "font-display font-medium tracking-tight text-ink",
          QUESTION_SIZE_CLASSES[fontSize],
        )}
      >
        {questionText ?? "오늘의 질문"}
      </h2>
      {questionTags.length > 0 && (
        <QuestionTagBadges tags={questionTags} className="mt-3" />
      )}
      <div className="mt-4 h-px w-12 bg-hairline-strong" />
    </div>
  );
}
