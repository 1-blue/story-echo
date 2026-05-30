import type { Story } from "@storyecho/schemas";

/** SSOT: orval Story에서 Pick으로 파생 — 화면별 interface 중복 금지 */
export interface StoryListItem extends Pick<Story, "id" | "bodyText" | "createdAt"> {}

export interface StoryFormInput extends Pick<Story, "bodyText"> {
  visibility: Story["visibility"];
}

export type CreateStoryPayload = StoryFormInput;
