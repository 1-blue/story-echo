"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Info } from "lucide-react";
import {
  getGetApiV1StoriesCapsuleQueryKey,
  getGetApiV1StoriesDrawerQueryKey,
  usePostApiV1Stories,
} from "@storyecho/api-client";
import { useQueryClient } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import { usePhotoUpload } from "@/app/write/_hooks/use-photo-upload";
import { CapsuleDurationPicker } from "./capsule-duration-picker";
import { CapsuleWriteHeader } from "./capsule-write-header";
import { RecipientSection } from "./recipient-section";
import { SealConfirmDialog } from "./seal-confirm-dialog";
import { getErrorMessage } from "@/lib/get-error-message";

type CapsuleWriteFormProps = {
  photoUploadEnabled: boolean;
};

export function CapsuleWriteForm({ photoUploadEnabled }: CapsuleWriteFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const createStory = usePostApiV1Stories();

  const [bodyText, setBodyText] = useState("");
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [unlockAt, setUnlockAt] = useState<string | null>(null);
  const [showSealDialog, setShowSealDialog] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const photoUpload = usePhotoUpload({
    enabled: photoUploadEnabled,
    maxPhotos: 1,
    onChange: setPhotoUrls,
  });

  const canSeal = bodyText.trim().length > 0 && Boolean(unlockAt);

  const handleSealClick = () => {
    if (!bodyText.trim()) {
      toast.error("편지 내용을 입력해주세요.");
      return;
    }
    if (!unlockAt) {
      toast.error("해제일을 선택해주세요.");
      return;
    }
    setAgreed(false);
    setShowSealDialog(true);
  };

  const handleConfirmSeal = async () => {
    if (!unlockAt) return;

    try {
      const result = await createStory.mutateAsync({
        data: {
          bodyText: bodyText.trim(),
          photoUrls,
          visibility: "private",
          isCapsule: true,
          unlockAt,
          questionId: null,
        },
      });

      await queryClient.invalidateQueries({ queryKey: getGetApiV1StoriesCapsuleQueryKey() });
      await queryClient.invalidateQueries({ queryKey: getGetApiV1StoriesDrawerQueryKey() });
      setShowSealDialog(false);
      router.push(`/capsule/${result.data.id}`);
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
    }
  };

  return (
    <div className="bg-canvas flex min-h-dvh flex-col">
      <CapsuleWriteHeader
        onCancel={() => router.back()}
        onSeal={handleSealClick}
        canSeal={canSeal}
        isSubmitting={createStory.isPending || photoUpload.isUploading}
      />

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-5 pt-6 pb-8">
        <section className="flex flex-col gap-3">
          <h2 className="text-charcoal text-lg font-semibold">편지</h2>
          <Textarea
            value={bodyText}
            onChange={(event) => setBodyText(event.target.value)}
            placeholder="미래의 나에게 전하고 싶은 말을 적어주세요."
            className="text-ink placeholder:text-stone min-h-[240px] resize-none border-none bg-transparent p-0 text-lg shadow-none focus-visible:ring-0"
          />
          {!bodyText.trim() && (
            <p className="text-stone text-xs">편지를 작성하면 봉인할 수 있어요.</p>
          )}

          {photoUploadEnabled && (
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
                <label className="border-hairline-strong text-slate hover:bg-surface-cream/60 flex size-20 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed">
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

        <CapsuleDurationPicker unlockAt={unlockAt} onChange={setUnlockAt} />
        <RecipientSection />

        <section className="bg-capsule-soft border-capsule/20 flex flex-col gap-2 rounded-xl border p-4">
          <div className="text-capsule flex items-center gap-2 text-xs font-semibold">
            <Info className="size-4" strokeWidth={1.75} />
            타임캡슐 안내
          </div>
          <ul className="text-slate list-disc space-y-1 pl-5 text-xs leading-relaxed">
            <li>봉인 후에는 수정할 수 없고, 삭제만 가능해요.</li>
            <li>해제일까지 편지와 사진을 볼 수 없어요.</li>
          </ul>
        </section>
      </main>

      <SealConfirmDialog
        open={showSealDialog}
        onOpenChange={setShowSealDialog}
        unlockAt={unlockAt}
        bodyPreview={bodyText.trim()}
        agreed={agreed}
        onAgreedChange={setAgreed}
        onConfirm={handleConfirmSeal}
        isSubmitting={createStory.isPending}
      />
    </div>
  );
}
