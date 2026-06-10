"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Info, Quote } from "lucide-react";
import { toast } from "sonner";
import {
  getGetApiV1CommunityPostsIdQueryKey,
  getGetApiV1CommunityPostsQueryKey,
  usePatchApiV1CommunityPostsId,
  usePostApiV1CommunityPosts,
} from "@storyecho/api-client";
import { usePhotoUpload } from "@/app/write/_hooks/use-photo-upload";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/lib/get-error-message";
import type { TodayQuestion } from "@/lib/today-question";
import { getCommunityBlockedMessage, type WriteCapabilities } from "@/lib/write-capabilities";
import { CommunityWriteHeader } from "./community-write-header";
import { EmailVerificationDialog } from "./email-verification-dialog";

type QuestionOption = {
  id: string | null;
  text: string;
  label: string;
};

type QuestionMode = "today" | "previous" | "free";

type CommunityWriteFormBaseProps = {
  photoUploadEnabled: boolean;
  capabilities: WriteCapabilities;
};

type CreateCommunityWriteFormProps = CommunityWriteFormBaseProps & {
  mode: "create";
  todayQuestion: TodayQuestion;
  previousQuestions: QuestionOption[];
};

type EditCommunityWriteFormProps = CommunityWriteFormBaseProps & {
  mode: "edit";
  postId: string;
  initialBodyText: string;
  initialPhotoUrls: string[];
  initialQuestionText: string | null;
};

export type CommunityWriteFormProps = CreateCommunityWriteFormProps | EditCommunityWriteFormProps;

export function CommunityWriteForm(props: CommunityWriteFormProps) {
  const isEdit = props.mode === "edit";
  const router = useRouter();
  const queryClient = useQueryClient();
  const createPost = usePostApiV1CommunityPosts();
  const updatePost = usePatchApiV1CommunityPostsId();

  const [bodyText, setBodyText] = useState(isEdit ? props.initialBodyText : "");
  const [photoUrls, setPhotoUrls] = useState<string[]>(isEdit ? props.initialPhotoUrls : []);
  const [mode, setMode] = useState<QuestionMode>(() => {
    if (isEdit) return props.initialQuestionText ? "today" : "free";
    return "today";
  });
  const [selectedPreviousId, setSelectedPreviousId] = useState<string | null>(
    !isEdit ? (props.previousQuestions[0]?.id ?? null) : null,
  );
  const [showVerification, setShowVerification] = useState(false);

  const photoUpload = usePhotoUpload({
    enabled: props.photoUploadEnabled,
    maxPhotos: 1,
    initialUrls: isEdit ? props.initialPhotoUrls : [],
    onChange: setPhotoUrls,
  });

  const todayQuestion = !isEdit ? props.todayQuestion : null;
  const previousQuestions = !isEdit ? props.previousQuestions : [];

  const selectedQuestion = isEdit
    ? {
        id: null,
        text: props.initialQuestionText ?? "자유 주제",
        label: props.initialQuestionText ? "질문" : "자유 주제",
      }
    : mode === "today"
      ? todayQuestion!
      : mode === "previous"
        ? (previousQuestions.find((q) => q.id === selectedPreviousId) ?? {
            id: null,
            text: "질문을 선택해주세요",
            label: "이전 질문",
          })
        : { id: null, text: "자유 주제", label: "자유 주제" };

  const isSubmitting = createPost.isPending || updatePost.isPending || photoUpload.isUploading;

  const handleSubmit = async () => {
    if (!bodyText.trim()) {
      toast.error("내용을 입력해주세요.");
      return;
    }

    if (!props.capabilities.canUseCommunity) {
      setShowVerification(true);
      toast(getCommunityBlockedMessage(props.capabilities));
      return;
    }

    if (photoUpload.isUploading) {
      toast.error("사진 업로드가 끝날 때까지 기다려 주세요.");
      return;
    }

    try {
      if (isEdit) {
        await updatePost.mutateAsync({
          id: props.postId,
          data: {
            bodyText: bodyText.trim(),
            photoUrls,
          },
        });
        await queryClient.invalidateQueries({
          queryKey: getGetApiV1CommunityPostsIdQueryKey(props.postId),
        });
        await queryClient.invalidateQueries({ queryKey: getGetApiV1CommunityPostsQueryKey() });
        toast.success("수정했어요.");
        router.push(`/community/${props.postId}`);
      } else {
        const result = await createPost.mutateAsync({
          data: {
            bodyText: bodyText.trim(),
            photoUrls,
            questionId: mode === "free" ? null : selectedQuestion.id,
          },
        });

        await queryClient.invalidateQueries({ queryKey: getGetApiV1CommunityPostsQueryKey() });
        router.push(`/community/${result.data.id}`);
      }
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <CommunityWriteHeader
        mode={props.mode}
        onCancel={() => router.back()}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-5 pt-6 pb-[calc(2rem+var(--safe-area-bottom))]">
        {!isEdit && (
          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-charcoal">어떤 질문에 대한 이야기인가요?</h2>
            <div className="flex gap-2 overflow-x-auto pb-1">
              <QuestionChip
                active={mode === "today"}
                onClick={() => setMode("today")}
                label="오늘의 질문"
              />
              <QuestionChip
                active={mode === "previous"}
                onClick={() => setMode("previous")}
                label="이전 질문"
              />
              <QuestionChip
                active={mode === "free"}
                onClick={() => setMode("free")}
                label="자유 주제"
              />
            </div>

            {mode === "previous" && previousQuestions.length > 0 && (
              <div className="flex flex-col gap-2">
                {previousQuestions.map((question) => (
                  <button
                    key={question.id}
                    type="button"
                    onClick={() => setSelectedPreviousId(question.id)}
                    className={`rounded-lg border border-hairline px-3 py-2 text-left text-sm transition-colors ${
                      selectedPreviousId === question.id
                        ? "border-primary bg-terracotta-soft/40"
                        : "bg-white hover:bg-surface-cream/60"
                    }`}
                  >
                    {question.text}
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        {mode !== "free" && selectedQuestion.text !== "자유 주제" && (
          <div className="flex items-start gap-3 rounded-xl border border-hairline bg-white p-4 shadow-sm">
            <Quote className="mt-0.5 size-6 shrink-0 text-primary opacity-70" strokeWidth={1.75} />
            <p className="font-display text-lg leading-snug text-ink">{selectedQuestion.text}</p>
          </div>
        )}

        {!isEdit && <hr className="border-hairline" />}

        <section className="flex flex-1 flex-col gap-4">
          <Textarea
            value={bodyText}
            onChange={(event) => setBodyText(event.target.value)}
            placeholder="오늘의 질문에 대해 어떻게 생각하세요? 자유롭게 적어주세요."
            className="min-h-[300px] flex-1 resize-none border-none bg-transparent p-0 text-lg text-ink shadow-none placeholder:text-stone focus-visible:ring-0"
          />

          {props.photoUploadEnabled && (
            <div className="flex gap-2">
              {photoUpload.photos.map((photo) => (
                <div key={photo.id} className="relative size-20 overflow-hidden rounded-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.previewUrl} alt="" className="size-full object-cover" />
                  <button
                    type="button"
                    onClick={() => photoUpload.removePhoto(photo.id)}
                    className="absolute top-1 right-1 rounded-full bg-black/50 px-1.5 text-xs text-white"
                  >
                    ×
                  </button>
                </div>
              ))}
              {photoUpload.canAddMore && (
                <label className="flex size-20 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-hairline-strong text-slate hover:bg-surface-cream/60">
                  <span className="text-2xl">+</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(event) => {
                      if (event.target.files) void photoUpload.addPhotos(event.target.files);
                    }}
                  />
                </label>
              )}
            </div>
          )}
        </section>

        {!isEdit && (
          <section className="flex flex-col gap-2 rounded-xl border border-community-green/20 bg-community-soft p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-community-green">
              <Info className="size-4" strokeWidth={1.75} />
              커뮤니티 안내
            </div>
            <ul className="list-disc space-y-1 pl-5 text-xs leading-relaxed text-slate">
              <li>커뮤니티에 올라가요. 서랍·오늘 공개 페이지와는 별개예요.</li>
              <li>닉네임과 함께 표시됩니다.</li>
            </ul>
          </section>
        )}
      </main>

      <EmailVerificationDialog open={showVerification} onOpenChange={setShowVerification} />
    </div>
  );
}

function QuestionChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <Button
      type="button"
      variant={active ? "default" : "outline"}
      onClick={onClick}
      className="rounded-full whitespace-nowrap"
    >
      {label}
    </Button>
  );
}
