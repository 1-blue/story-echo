import Image from "next/image";
import { cn } from "@/lib/utils";

type StoryDetailGalleryProps = {
  photoUrls: string[];
};

function GalleryImage({ url, className }: { url: string; className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-hairline bg-stone/10",
        className,
      )}
    >
      <Image
        src={url}
        alt=""
        fill
        className="object-cover"
        sizes="(max-width: 480px) 100vw, 480px"
        unoptimized
      />
    </div>
  );
}

export function StoryDetailGallery({ photoUrls }: StoryDetailGalleryProps) {
  if (photoUrls.length === 0) return null;

  if (photoUrls.length === 1) {
    return (
      <div className="relative mb-10 aspect-video w-full">
        <GalleryImage url={photoUrls[0]!} className="absolute inset-0" />
      </div>
    );
  }

  if (photoUrls.length <= 3) {
    return (
      <div className="mb-10 flex flex-col gap-3">
        {photoUrls.map((url, index) => (
          <div key={`${url}-${index}`} className="relative aspect-[4/3] w-full">
            <GalleryImage url={url} className="absolute inset-0" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mb-10 grid grid-cols-2 gap-3">
      {photoUrls.map((url, index) => (
        <div key={`${url}-${index}`} className="relative aspect-square w-full">
          <GalleryImage url={url} className="absolute inset-0" />
        </div>
      ))}
    </div>
  );
}
