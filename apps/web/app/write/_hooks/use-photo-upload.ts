"use client";

import { useCallback, useState } from "react";
import { usePostApiV1UploadsPresign } from "@storyecho/api-client";
import { generateUuid } from "@storyecho/api-client/generate-uuid";
import type { PresignContentType } from "@storyecho/schemas";
import type { PhotoUploadItem } from "@/features/stories/types";

const ALLOWED_TYPES = new Set<string>(["image/jpeg", "image/png", "image/webp"]);

function toPresignContentType(type: string): PresignContentType | null {
  if (!ALLOWED_TYPES.has(type)) return null;
  return type as PresignContentType;
}

type UsePhotoUploadOptions = {
  enabled: boolean;
  maxPhotos?: number;
  initialUrls?: string[];
  onChange?: (urls: string[]) => void;
};

function urlsToPhotoItems(urls: string[]): PhotoUploadItem[] {
  return urls.map((url) => ({
    id: url,
    previewUrl: url,
    publicUrl: url,
    status: "done" as const,
  }));
}

export function usePhotoUpload({
  enabled,
  maxPhotos = 8,
  initialUrls = [],
  onChange,
}: UsePhotoUploadOptions) {
  const [photos, setPhotos] = useState<PhotoUploadItem[]>(() => urlsToPhotoItems(initialUrls));
  const presignMutation = usePostApiV1UploadsPresign();

  const syncUrls = useCallback(
    (items: PhotoUploadItem[]) => {
      const urls = items
        .filter((item) => item.status === "done" && item.publicUrl)
        .map((item) => item.publicUrl as string);
      onChange?.(urls);
    },
    [onChange],
  );

  const removePhoto = useCallback(
    (id: string) => {
      setPhotos((prev) => {
        const next = prev.filter((item) => {
          if (item.id === id && item.previewUrl.startsWith("blob:")) {
            URL.revokeObjectURL(item.previewUrl);
          }
          return item.id !== id;
        });
        syncUrls(next);
        return next;
      });
    },
    [syncUrls],
  );

  const uploadPhoto = useCallback(
    async (file: File) => {
      if (!enabled) {
        throw new Error("AWS S3가 설정되지 않아 사진 업로드를 사용할 수 없습니다.");
      }

      const contentType = toPresignContentType(file.type);
      if (!contentType) {
        throw new Error("JPEG, PNG, WebP 이미지만 업로드할 수 있습니다.");
      }

      const id = generateUuid();
      const previewUrl = URL.createObjectURL(file);
      const pendingItem: PhotoUploadItem = {
        id,
        previewUrl,
        status: "uploading",
        file,
      };

      setPhotos((prev) => {
        if (prev.length >= maxPhotos) {
          return prev;
        }
        return [...prev, pendingItem];
      });

      try {
        const presign = await presignMutation.mutateAsync({
          data: {
            contentType,
            fileName: file.name,
            fileSize: file.size,
          },
        });

        const uploadResponse = await fetch(presign.data.uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": contentType },
          body: file,
        });

        if (!uploadResponse.ok) {
          throw new Error("S3 업로드에 실패했습니다.");
        }

        setPhotos((prev) => {
          const next = prev.map((item) =>
            item.id === id
              ? { ...item, status: "done" as const, publicUrl: presign.data.publicUrl }
              : item,
          );
          syncUrls(next);
          return next;
        });
      } catch {
        setPhotos((prev) => {
          const next = prev.map((item) =>
            item.id === id ? { ...item, status: "error" as const } : item,
          );
          syncUrls(next);
          return next;
        });
        throw new Error("사진 업로드에 실패했습니다.");
      }
    },
    [enabled, maxPhotos, presignMutation, syncUrls],
  );

  const addPhotos = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files);
      const remaining = maxPhotos - photos.length;
      const toUpload = list.slice(0, remaining);

      for (const file of toUpload) {
        await uploadPhoto(file);
      }
    },
    [maxPhotos, photos.length, uploadPhoto],
  );

  return {
    photos,
    addPhotos,
    removePhoto,
    canAddMore: enabled && photos.length < maxPhotos,
    isUploading: photos.some((item) => item.status === "uploading"),
  };
}
