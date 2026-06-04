"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import type { WriteStoryFormValues } from "@/features/stories/types";
import type { TodayQuestion } from "@/lib/today-question";
import type { WriteCapabilities } from "@/lib/write-capabilities";
import { getCommunityBlockedMessage } from "@/lib/write-capabilities";
import { useCreateStory } from "../_hooks/use-create-story";
import { usePhotoUpload } from "../_hooks/use-photo-upload";
import { useUpdateStory } from "../_hooks/use-update-story";
import { useWriteStoryForm } from "../_hooks/use-write-story-form";
import { CapsuleDialog } from "./capsule-dialog";
import { PhotoUploadGrid } from "./photo-upload-grid";
import { QuestionBar } from "./question-bar";
import { VisibilityToggle } from "./visibility-toggle";
import { WriteHeader } from "./write-header";
import { getErrorMessage } from "@/lib/get-error-message";

const FORM_ID = "write-story-form";

type WriteStoryFormBaseProps = {
  questionText: string;
  photoUploadEnabled: boolean;
  capabilities: WriteCapabilities;
};

type CreateWriteStoryFormProps = WriteStoryFormBaseProps & {
  mode: "create";
  question: TodayQuestion;
};

type EditWriteStoryFormProps = WriteStoryFormBaseProps & {
  mode: "edit";
  storyId: string;
  initialValues: WriteStoryFormValues;
};

export type WriteStoryFormProps = CreateWriteStoryFormProps | EditWriteStoryFormProps;

export function WriteStoryForm(props: WriteStoryFormProps) {
  const isEdit = props.mode === "edit";
  const questionId = isEdit ? props.initialValues.questionId : props.question.id;

  const form = useWriteStoryForm({
    questionId: questionId ?? null,
    defaultValues: isEdit ? props.initialValues : undefined,
  });

  const { createStory, isPending: isCreating } = useCreateStory(props.capabilities);
  const { updateStory, isPending: isUpdating } = useUpdateStory(
    isEdit ? props.storyId : "",
    props.capabilities,
  );
  const [submitError, setSubmitError] = useState<string | null>(null);

  const initialPhotoUrls = isEdit ? props.initialValues.photoUrls : [];

  const photoUpload = usePhotoUpload({
    enabled: props.photoUploadEnabled,
    initialUrls: initialPhotoUrls,
    onChange: (urls) => form.setValue("photoUrls", urls, { shouldValidate: true }),
  });

  const bodyText = form.watch("bodyText");
  const isCapsule = form.watch("isCapsule");
  const unlockAt = form.watch("unlockAt");
  const isPending = isCreating || isUpdating;

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null);

    if (photoUpload.isUploading) {
      setSubmitError("사진 업로드가 끝날 때까지 기다려 주세요.");
      return;
    }

    if (values.visibility === "community" && !props.capabilities.canUseCommunity) {
      toast(getCommunityBlockedMessage(props.capabilities));
      return;
    }

    try {
      if (isEdit) {
        await updateStory(values);
      } else {
        await createStory(values);
      }
    } catch (error) {
      const message = getErrorMessage(error);
      setSubmitError(message);
      toast.error(message);
    }
  });

  return (
    <div className="mx-auto flex h-dvh min-h-[-webkit-fill-available] w-full max-w-lg flex-col bg-canvas text-foreground">
      <Form {...form}>
        <form id={FORM_ID} onSubmit={onSubmit} className="flex h-full min-h-0 flex-col">
          <div className="z-50 flex shrink-0 flex-col border-b border-hairline bg-canvas/95 pt-[var(--safe-area-top)] backdrop-blur-md">
            <WriteHeader
              formId={FORM_ID}
              isSubmitting={isPending || photoUpload.isUploading}
              mode={props.mode}
            />
            <QuestionBar question={props.questionText} />
          </div>

          <main className="flex min-h-0 flex-1 flex-col px-5 py-3">
            <FormField
              control={form.control}
              name="bodyText"
              render={({ field }) => (
                <FormItem className="flex h-full min-h-0 flex-1 flex-col space-y-0">
                  <FormControl>
                    <Textarea
                      {...field}
                      autoFocus
                      placeholder="마음속 깊은 곳의 이야기를 천천히 꺼내보세요..."
                      className="h-full min-h-0 flex-1 resize-none border-none bg-transparent p-0 text-lg text-ink shadow-none placeholder:text-stone focus-visible:ring-0"
                    />
                  </FormControl>
                  <div className="mt-2 flex shrink-0 justify-end">
                    <span className="text-xs text-slate">{bodyText.length}/5000</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </main>

          <div className="shrink-0 border-t border-hairline bg-canvas px-5 py-4 pb-[var(--safe-area-bottom)] shadow-[0_-4px_24px_rgba(243,237,228,0.5)]">
            <PhotoUploadGrid
              photos={photoUpload.photos}
              canAddMore={photoUpload.canAddMore}
              isUploading={photoUpload.isUploading}
              uploadEnabled={props.photoUploadEnabled}
              onAdd={photoUpload.addPhotos}
              onRemove={photoUpload.removePhoto}
            />

            <div className="flex items-center justify-between pb-2">
              <FormField
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <VisibilityToggle
                    value={field.value}
                    onChange={field.onChange}
                    capabilities={props.capabilities}
                  />
                )}
              />
              {!isEdit && (
                <CapsuleDialog
                  unlockAt={unlockAt}
                  isCapsule={isCapsule}
                  onApply={(nextUnlockAt) => {
                    form.setValue("unlockAt", nextUnlockAt, { shouldValidate: true });
                    form.setValue("isCapsule", Boolean(nextUnlockAt), { shouldValidate: true });
                  }}
                />
              )}
            </div>

            {submitError && <p className="mt-2 text-sm text-destructive">{submitError}</p>}
          </div>
        </form>
      </Form>
    </div>
  );
}
