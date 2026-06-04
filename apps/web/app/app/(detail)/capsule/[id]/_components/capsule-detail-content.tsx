"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Info, Lock } from "lucide-react";
import { toast } from "sonner";
import {
  getGetApiV1StoriesCapsuleQueryKey,
  getGetApiV1StoriesDrawerQueryKey,
  useDeleteApiV1StoriesId,
  useGetApiV1StoriesCapsuleIdSuspense,
} from "@storyecho/api-client";
import { formatUnlockDateKo } from "@/lib/capsule-utils";
import { formatStoryDayLong } from "@/lib/format-story-date";
import { CapsuleDetailHeader } from "./capsule-detail-header";
import { DeleteSheet } from "./delete-sheet";
import { SealedOverlay } from "./sealed-overlay";
import { getErrorMessage } from "@/lib/get-error-message";

type CapsuleDetailContentProps = {
  capsuleId: string;
};

export function CapsuleDetailContent({ capsuleId }: CapsuleDetailContentProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data } = useGetApiV1StoriesCapsuleIdSuspense(capsuleId);
  const capsule = data.data;
  const deleteMutation = useDeleteApiV1StoriesId();
  const [showDeleteSheet, setShowDeleteSheet] = useState(false);

  const isSealed = capsule.isCapsuleActive;

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync({ id: capsuleId });
      await queryClient.invalidateQueries({ queryKey: getGetApiV1StoriesCapsuleQueryKey() });
      await queryClient.invalidateQueries({ queryKey: getGetApiV1StoriesDrawerQueryKey() });
      toast.success("타임캡슐을 삭제했어요.");
      router.push("/app/capsule");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <>
      <CapsuleDetailHeader onDelete={() => setShowDeleteSheet(true)} />

      <main className="mx-auto w-full max-w-lg flex-1 px-5 py-6 pb-[calc(7rem+var(--safe-area-bottom))]">
        {isSealed ? (
          <div className="mb-6 flex flex-col items-center gap-2 text-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-capsule-soft">
              <Lock className="size-10 text-capsule" strokeWidth={1.75} />
            </div>
            <p className="text-3xl font-bold text-capsule">D-{capsule.daysUntilUnlock}</p>
            <p className="text-sm text-slate">{formatUnlockDateKo(capsule.unlockAt)}에 열립니다</p>
          </div>
        ) : (
          <div className="mb-6">
            <span className="inline-flex items-center rounded-full bg-capsule-soft px-2.5 py-1 text-xs font-semibold text-capsule">
              열림
            </span>
            <p className="mt-2 text-sm text-stone">{formatStoryDayLong(capsule.unlockAt)}에 열림</p>
          </div>
        )}

        {capsule.questionText && (
          <div className="mb-6 rounded-xl border border-hairline bg-white p-5 shadow-sm">
            <h2 className="text-xl leading-snug font-bold text-ink">{capsule.questionText}</h2>
          </div>
        )}

        {isSealed ? (
          <SealedOverlay />
        ) : (
          <>
            <article className="mb-6 text-base leading-relaxed whitespace-pre-wrap text-ink">
              {capsule.bodyText}
            </article>
            {capsule.photoUrls && capsule.photoUrls.length > 0 && (
              <div className="mb-6 overflow-hidden rounded-xl border border-hairline bg-white shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={capsule.photoUrls[0]}
                  alt=""
                  className="max-h-[400px] w-full object-cover"
                />
              </div>
            )}
            <div className="mb-6 flex items-start gap-2 rounded-xl border border-hairline bg-surface-cream/60 p-4 text-sm">
              <Info className="mt-0.5 size-4 shrink-0 text-capsule" strokeWidth={1.75} />
              <p className="text-slate">열린 캡슐은 수정할 수 없어요. 삭제만 가능합니다.</p>
            </div>
          </>
        )}

        {isSealed && (
          <div className="mt-6 flex flex-col gap-2 rounded-xl border border-capsule/20 bg-capsule-soft p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-capsule">
              <Info className="size-4" strokeWidth={1.75} />
              봉인 안내
            </div>
            <ul className="list-disc space-y-1 pl-5 text-xs leading-relaxed text-slate">
              <li>수정할 수 없어요.</li>
              <li>삭제만 가능해요.</li>
              <li>받는 사람: {capsule.recipientLabel}</li>
            </ul>
          </div>
        )}

        <p className="mt-6 text-center text-xs text-stone">
          {formatStoryDayLong(capsule.createdAt)}에 작성
        </p>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-canvas px-5 py-4 pb-[calc(1rem+var(--safe-area-bottom))]">
        <button
          type="button"
          onClick={() => setShowDeleteSheet(true)}
          className="w-full text-center text-sm font-medium text-destructive"
        >
          타임캡슐 삭제
        </button>
      </div>

      <DeleteSheet
        open={showDeleteSheet}
        onClose={() => setShowDeleteSheet(false)}
        onConfirm={handleDelete}
        isSubmitting={deleteMutation.isPending}
      />
    </>
  );
}
