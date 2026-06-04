import { NotebookPen } from "lucide-react";

type QuestionBarProps = {
  question: string;
};

export function QuestionBar({ question }: QuestionBarProps) {
  return (
    <div className="border-b border-hairline px-5 py-2.5">
      <div className="flex items-start gap-2">
        <NotebookPen className="mt-0.5 size-[18px] shrink-0 text-stone" strokeWidth={1.75} />
        <p className="font-display text-[15px] leading-relaxed text-charcoal italic">{question}</p>
      </div>
    </div>
  );
}
