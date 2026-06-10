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
        "mb-10 border-l-2 border-hairline-strong pl-4 whitespace-pre-line text-charcoal",
        BODY_SIZE_CLASSES[fontSize],
      )}
    >
      {bodyText}
    </article>
  );
}
