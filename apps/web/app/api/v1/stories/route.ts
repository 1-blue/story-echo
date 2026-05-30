import {
  CreateStoryRequestSchema,
  StoryListResponseSchema,
  StoryResponseSchema,
} from "@storyecho/schemas";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured, toStoryDto } from "@/lib/story-mapper";

async function getOrCreateDemoUser() {
  const deviceId = "00000000-0000-4000-8000-000000000001";
  return prisma.user.upsert({
    where: { deviceId },
    update: {},
    create: { deviceId, role: "guest", nickname: "게스트" },
  });
}

export async function GET() {
  if (!isDatabaseConfigured()) {
    return Response.json(
      {
        message: "Database not configured. Set DATABASE_URL in .env.local",
        code: "DB_UNAVAILABLE",
      },
      { status: 503 }
    );
  }

  try {
    const stories = await prisma.story.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const body = StoryListResponseSchema.parse({
      data: stories.map(toStoryDto),
    });

    return Response.json(body);
  } catch {
    return Response.json(
      { message: "Failed to fetch stories", code: "DB_ERROR" },
      { status: 503 }
    );
  }
}

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return Response.json(
      {
        message: "Database not configured. Set DATABASE_URL in .env.local",
        code: "DB_UNAVAILABLE",
      },
      { status: 503 }
    );
  }

  try {
    const json: unknown = await request.json();
    const parsed = CreateStoryRequestSchema.safeParse(json);

    if (!parsed.success) {
      return Response.json(
        { message: parsed.error.message, code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    const user = await getOrCreateDemoUser();

    const story = await prisma.story.create({
      data: {
        userId: user.id,
        bodyText: parsed.data.bodyText,
        photoUrls: parsed.data.photoUrls,
        visibility: parsed.data.visibility,
        isCapsule: parsed.data.isCapsule,
        unlockAt: parsed.data.unlockAt ? new Date(parsed.data.unlockAt) : null,
        isCapsuleActive: parsed.data.isCapsule && Boolean(parsed.data.unlockAt),
      },
    });

    const body = StoryResponseSchema.parse({ data: toStoryDto(story) });
    return Response.json(body, { status: 201 });
  } catch {
    return Response.json(
      { message: "Failed to create story", code: "DB_ERROR" },
      { status: 503 }
    );
  }
}
