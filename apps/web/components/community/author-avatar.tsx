import { getInitial } from "@/lib/community-mapper";

type AuthorAvatarProps = {
  nickname: string;
  size?: "sm" | "md";
};

export function AuthorAvatar({ nickname, size = "sm" }: AuthorAvatarProps) {
  const dimension = size === "sm" ? "size-8" : "size-10";
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <div
      className={`bg-surface-cream text-primary flex ${dimension} shrink-0 items-center justify-center rounded-full font-semibold ${textSize}`}
    >
      {getInitial(nickname)}
    </div>
  );
}
