import type { CreateStoryRequest, Story } from "@storyecho/schemas";
import { VisibilitySchema } from "@storyecho/schemas";
import { z } from "zod";

export const WriteStoryFormSchema = z.object({
  bodyText: z.string().min(1, "이야기를 입력해 주세요").max(5000),
  photoUrls: z.array(z.string().url()).max(8),
  visibility: VisibilitySchema,
  isCapsule: z.boolean(),
  unlockAt: z.string().datetime().nullable(),
  questionId: z.string().uuid().nullable().optional(),
});

export type WriteStoryFormValues = z.infer<typeof WriteStoryFormSchema>;

export type WriteStoryPayload = CreateStoryRequest;

export interface StoryListItem extends Pick<Story, "id" | "bodyText" | "createdAt"> {}

export interface DrawerStoryItem
  extends Pick<
    Story,
    "id" | "bodyText" | "createdAt" | "isCapsule" | "isCapsuleActive" | "photoUrls"
  > {
  questionText: string | null;
  isEchoStory: boolean;
  isBookmarked: boolean;
}

export type DrawerStoryListMeta = {
  totalCount: number;
  activeCapsuleCount: number;
  oldestStoryAt: string | null;
  pagination?: {
    nextCursor: string | null;
    hasMore: boolean;
  };
};

export interface StoryDetailItem extends DrawerStoryItem {
  visibility: z.infer<typeof VisibilitySchema>;
  questionId: string | null;
}

export type PhotoUploadItem = {
  id: string;
  previewUrl: string;
  publicUrl?: string;
  status: "pending" | "uploading" | "done" | "error";
  file?: File;
};
