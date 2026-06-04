import { cn } from "@/lib/utils";
import { BODY_SIZE_CLASSES, type FontSizePreference } from "../_hooks/use-font-size";

type StoryDetailBodyProps = {
  bodyText: string;
  fontSize: FontSizePreference;
};

export function StoryDetailBody({ bodyText, fontSize }: StoryDetailBodyProps) {
  return (
    <article
      className={cn(
        "text-charcoal border-hairline-strong mb-10 border-l-2 pl-4 whitespace-pre-line",
        BODY_SIZE_CLASSES[fontSize],
      )}
    >
      {bodyText}
    </article>
  );
}
