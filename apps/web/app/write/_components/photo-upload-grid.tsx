"use client";

import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import type { PhotoUploadItem } from "@/features/stories/types";
import { cn } from "@/lib/utils";
import { getErrorMessage } from "@/lib/get-error-message";

type PhotoUploadGridProps = {
  photos: PhotoUploadItem[];
  canAddMore: boolean;
  isUploading: boolean;
  uploadEnabled: boolean;
  onAdd: (files: FileList) => Promise<void>;
  onRemove: (id: string) => void;
};

const INPUT_ID = "write-photo-upload-input";

export function PhotoUploadGrid({
  photos,
  canAddMore,
  isUploading,
  uploadEnabled,
  onAdd,
  onRemove,
}: PhotoUploadGridProps) {
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) {
      return;
    }
    try {
      await onAdd(files);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      event.target.value = "";
    }
  };

  return (
    <div className="mb-5">
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {canAddMore && (
          <label
            htmlFor={uploadEnabled && !isUploading ? INPUT_ID : undefined}
            className={cn(
              "flex size-[72px] shrink-0 flex-col items-center justify-center rounded-lg border-2 border-dashed border-hairline-strong bg-surface-cream/30 text-muted transition-all",
              uploadEnabled && !isUploading
                ? "cursor-pointer hover:border-primary hover:text-primary"
                : "cursor-not-allowed opacity-50",
            )}
          >
            {isUploading ? (
              <Loader2 className="size-6 animate-spin" />
            ) : (
              <>
                <ImagePlus className="mb-1 size-6" />
                <span className="text-xs">
                  {photos.length}/8
                </span>
              </>
            )}
            <input
              id={INPUT_ID}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/*"
              multiple
              className="sr-only"
              disabled={!uploadEnabled || isUploading}
              onChange={handleFileChange}
            />
          </label>
        )}

        {photos.map((photo) => (
          <div
            key={photo.id}
            className="group relative size-[72px] shrink-0 overflow-hidden rounded-lg border border-hairline"
          >
            <img
              src={photo.previewUrl}
              alt="업로드한 사진"
              className="size-full object-cover transition-transform group-hover:scale-105"
            />
            {photo.status === "uploading" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Loader2 className="size-5 animate-spin text-white" />
              </div>
            )}
            {photo.status === "error" && (
              <div className="absolute inset-0 flex items-center justify-center bg-destructive/20 text-[10px] font-medium text-destructive">
                실패
              </div>
            )}
            <button
              type="button"
              onClick={() => onRemove(photo.id)}
              className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-ink/60 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
      {!uploadEnabled && (
        <p className="text-xs text-stone">사진 업로드는 AWS S3 설정 후 사용할 수 있습니다.</p>
      )}
    </div>
  );
}
