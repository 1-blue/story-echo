import type { Metadata } from "next";
import { STORE_SEO_KEYWORDS } from "../../../mobile/store/listing.ko";

const sharedTitle: Metadata["title"] = {
  template: "%s | 이야기해줘",
  default: "이야기해줘",
};

const sharedDescription =
  "매일 하나의 질문. 오늘의 이야기를 남기고, 1년 뒤 Echo로 비교하고, 타임캡슐과 커뮤니티로 이어가는 자기성찰 PWA.";

const sharedKeywords = [...STORE_SEO_KEYWORDS, "PWA"];

const sharedImages = ["/opengraph-image"];

const getSharedKeywords = (title: string) => [
  `${title} 이야기해줘`,
  `${title} 이야기`,
  `${title} 질문`,
  `${title} 일기`,
];

export interface GetSharedMetadataArgs {
  title?: Metadata["title"];
  description?: string;
  keywords?: string[];
  images?: string[];
  robots?: Metadata["robots"];
}

function resolveTitleString(title: Metadata["title"] | undefined): string {
  if (!title) return "이야기해줘";
  if (typeof title === "string") return title;
  if ("default" in title && title.default) return String(title.default);
  if ("absolute" in title && title.absolute) return String(title.absolute);
  return "이야기해줘";
}

/** 공용으로 사용할 메타데이터 */
export const getSharedMetadata = ({
  title = sharedTitle,
  description = sharedDescription,
  keywords = [],
  images = sharedImages,
  robots,
}: GetSharedMetadataArgs = {}): Metadata => {
  const titleString = resolveTitleString(title);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    keywords: [...new Set([...sharedKeywords, ...getSharedKeywords(titleString), ...keywords])],
    ...(robots ? { robots } : {}),
    openGraph: {
      title: titleString,
      description,
      images,
      type: "website",
      url: baseUrl,
      siteName: "이야기해줘",
      locale: "ko_KR",
    },
    twitter: {
      card: "summary_large_image",
      title: titleString,
      description,
      images,
    },
  };
};

export { sharedDescription, sharedTitle, sharedKeywords, sharedImages };
