import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getSharedMetadata } from "@/lib/seo/get-shared-metadata";
import { PublicDetailPageClient } from "./_components/public-detail-page-client";

type PublicStoryPageProps = {
  params: Promise<{ id: string }>;
};

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}…`;
}

export async function generateMetadata({ params }: PublicStoryPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const story = await prisma.story.findFirst({
      where: {
        id,
        visibility: "community",
        hiddenFromFeed: false,
        isCapsuleActive: false,
      },
      include: { question: { select: { text: true } } },
    });

    if (!story) {
      return getSharedMetadata({
        title: "공개 이야기",
        description: "공개된 이야기를 찾을 수 없습니다.",
        robots: { index: false, follow: false },
      });
    }

    const title = story.question?.text ?? truncate(story.bodyText, 30);
    const description = truncate(story.bodyText, 120);

    return getSharedMetadata({
      title,
      description,
      robots: { index: true, follow: true },
    });
  } catch {
    return getSharedMetadata({
      title: "공개 이야기",
      robots: { index: true, follow: true },
    });
  }
}

export default async function PublicStoryPage({ params }: PublicStoryPageProps) {
  const { id } = await params;
  return <PublicDetailPageClient storyId={id} />;
}
