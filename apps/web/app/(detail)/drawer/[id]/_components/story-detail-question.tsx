import { cn } from "@/lib/utils";
import {
  QUESTION_SIZE_CLASSES,
  type FontSizePreference,
} from "../_hooks/use-font-size";

type StoryDetailQuestionProps = {
  questionText: string | null;
  fontSize: FontSizePreference;
};

export function StoryDetailQuestion({ questionText, fontSize }: StoryDetailQuestionProps) {
  return (
    <div className="mb-8">
      <h2
        className={cn(
          "text-ink font-display font-medium tracking-tight",
          QUESTION_SIZE_CLASSES[fontSize],
        )}
      >
        {questionText ?? "오늘의 질문"}
      </h2>
      <div className="bg-hairline-strong mt-4 h-px w-12" />
    </div>
  );
}
